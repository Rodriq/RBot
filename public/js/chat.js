$(function() {
    var socket = io.connect('http://localhost:3000')

    var message = $("#write_msg")

    var send_message = $("#send-msg")
    var chatroom = $("#msg_history")
    var feedback = $("#feedback")




    var talkToBot = () => {

        if (message.val() != '') {

            var time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            socket.emit('new_message', { message: message.val() })
            chatroom.append(
                `<div class="outgoing_msg" >
				<div class="sent_msg">
				<p>${message.val()}</p>
				<span class="time_date"> ${time} | Today</span>
				</div>
				</div>`)
            message.val('');
            $('.mesgs').height() - $('#msg_history').height() - 30

        }

    }

    message.on('keyup', function(e) {
        if (e.keyCode === 13) {
            talkToBot()
        }
    });
    send_message.click(function() {
        talkToBot()

    })

    socket.on("new_message", (data) => {
        time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        message.val('');

    })


    socket.on("new_image", (data) => {
        console.log(data.url)
        console.log(data)
        time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        message.val('');
        chatroom.append(
            `<div class="incoming_msg">
                        <div class="incoming_msg_img"> <img src="images/bot.png" alt="sunil"> </div>
                        <div class="received_msg">
							<div class="received_withd_msg">
								<img class="img-thumbnail" src="${data.url}" alt="">
                                <span class="time_date"> ${time} | Today</span>
                            </div>
                        </div>
                    </div>`)

    });

    socket.on('virus_info', (data) => {
        console.log(data.result)
        console.log(data.result[0])
        console.log(typeof(data.result))
        var res = data.result[0]
        var country = Object.keys(res)[0];
        var date = Object.keys(res)[1];
        var states = Object.keys(res)[2];

        var numberOfRes = Object.values(res)[2];
        time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        chatroom.append(
            `<div class="incoming_msg">
                            <div class="incoming_msg_img"> <img src="images/bot.png" alt="sunil"> </div>
                            <div class="received_msg">
								<div class="received_withd_msg">
								
            						<p><b>${country} :</b>${res.country}</p>
            						
									<button type="button" class="btn btn-sm btn-primary">
  									${states}
  									<span class="badge badge-light">${numberOfRes}</span>
									</button>									
									<p><b>${date} :</b>${res.date}</p>
                                    <span class="time_date"> ${time} | Today</span>
                                </div>
                            </div>
                        </div>`)
    })

    socket.on('help', (data) => {
        time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        chatroom.append(
            `<div class="incoming_msg">
                        <div class="incoming_msg_img"> <img src="images/bot.png" alt="sunil"> </div>
                        <div class="received_msg">
							<div class="received_withd_msg">
								<h4>Help Panel</h4>
								<hr>
								<pre>
<h7>For Corona Virus info type:</h7>
   <code>{keyWord} {condition} {country}</code>

	{keyWord}: corona or covid-19 or virus
	{condition}: death or recovered or confirmed
	{country}: Cameroon, Nigeria, virus
   <b>Example:  corona death Cameroon</b>

<h7>For Photos type:<h7>
    <code>{keyWord} {imageType}</code>
	{keyWord}: photo or image or picture
	{imageType}: nature, tree, love
    <b>Example: photo forest</b>
								
								</pre>
                                <span class="time_date"> ${time} | Today</span>
                            </div>
                        </div>
                    </div>`)
    })

    socket.on('no_query', (data) => {
        time = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        chatroom.append(
            `<div class="incoming_msg">
                        <div class="incoming_msg_img"> <img src="images/bot.png" alt="sunil"> </div>
                        <div class="received_msg">
							<div class="received_withd_msg">
								<p style="color: red;">${data.message}</p>
                                <span class="time_date"> ${time} | Today</span>
                            </div>
                        </div>
                    </div>`)
    })

});