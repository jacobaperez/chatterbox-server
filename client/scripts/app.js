var app = {};
app.server = 'http://127.0.0.1:3000/classes/messages';
app.users = [];
app.friends = [];
app.data = {};
app.room;
app.myRooms = [];
app.newData;
app.userName;

$(document).ready(function() {

	$('#newMessageButton').on('click', function(event) {
		var text = $(newMessageText)[0].value;
		if (text !== undefined) {
			var room = app.room;
				var newMessage = {
	  		username: app.username,
	  		text: text,
	  		roomname: room
			};
			$(newMessageText)[0].value = '';
			app.send(newMessage);
			app.fetch();
		}
	});

	$('#newRoomButton').on('click', function(event) {
		var newRoom = $(newRoomText)[0].value;
		if (newRoom !== undefined) {
			app.room = newRoom;
			$(newRoomText)[0].value = '';
			app.myRooms.unshift(newRoom);	
			$('#roomSelect').empty();
			app.renderRooms();
			app.renderMessages();
		}
	});

	$('#roomSelect').on('change', function(event) {
		app.room = event.target.value;
		app.renderMessages();
	});

	$('.userName').on('click', function(event) {
		console.log(event);
		// app.room = event.target.value;
		// app.renderMessages();
	});

	app.init();
});

app.init = function() {
	app.fetch();
	app.username = prompt();
};

app.renderRooms = function() {
	var rooms = app.data.results.map(message => message.roomname).concat(app.myRooms);
	app.rooms = [...new Set(app.myRooms.concat(rooms))];
	app.rooms.forEach(room => app.addRoom(_.escape(room)));
	app.room = $('#roomSelect')[0].value;

};

app.addRoom = function(room) {
	var option = $('<option>'+room+'</option>');
	option.value = room;
	$('#roomSelect').append(option);
};

app.renderMessages = function() {
	app.clearMessages();
	app.data.results
		.filter(message => app.room ? message.roomname === app.room : true)
		.forEach(message => app.renderMessage(message));
};

app.renderMessage = function(message) {
	var text = _.escape(message.text);
	var user = _.escape(message.username);
	var room = _.escape(message.roomname);
	var divs = $(
		'<div class="userName">User: '+user+'</div>' + 
		'<div>Message: '+text+'</div>' +
		'<div>Room: '+room+'</div>' +
		'<br/>'
	);
	
	$('#chats').append(divs);
};

app.send = function(message) {
	$.ajax({
	  url: app.server,
	  type: 'POST',
	  data: JSON.stringify(message),
	  contentType: 'application/json',
	  success: function (data) {
	    console.log('chatterbox: Message sent');
	  },
	  error: function (data) {
	    console.error('chatterbox: Failed to send message', data);
	  }
	});
};

app.fetch = function(room) {
  $.ajax({
    url: app.server,
    type: 'GET',
    // data: {order: '-createdAt'},
    success: function (data) {
    	app.data = data;
  		app.renderRooms();
   		app.renderMessages();
    	console.log('chatterbox: Messages received');
    },
    error: function (data) {
      console.error('chatterbox: Failed to get messages');
    }
  });
};

app.clearMessages = function() {
	$('#chats').empty();
};
