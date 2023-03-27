(function executeRule(current, previous /*null when async*/) {
	//First, we have to get the context for the workflow running against current.
	var context = '';
	var wf = new GlideRecord('wf_context');
	wf.addQuery('id', current.sys_id);
	wf.query();
	while(wf.next()) {
		context = wf.getValue('sys_id');
	}
	

	//this is the name of your timer activity in the worklow - since you can have more than one. 
	var timer_name = 'Wait till scheduled publish date';
	var doc_id = '';
	
	
	//Now we have to get the executing workflow activity records associated to the context.
	var wf_executing = new GlideRecord('wf_executing');
	wf_executing.addQuery('context', context);
	wf_executing.query();
	
	//Now we cycle through the activities to find the one we have named.
	while(wf_executing.next()){
		
		if(wf_executing.activity.name.toString() === timer_name) {
			doc_id = wf_executing.getValue('sys_id');
		}
		
	}
	
	//Now, we use everything we have learned to find the right entry in the scheduled job table.
	var schedule = new GlideRecord('sys_trigger');
	schedule.addQuery('document_key', doc_id );
	schedule.query();
	while(schedule.next()) {
		//and here comes the magic
		//update the next_action field using the value in the appointment_time variable.
		schedule.next_action = current.scheduled_publish_date;
		schedule.update();
		
	}
	
	//Success!
	
})(current, previous);
