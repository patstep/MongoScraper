// grab the articles as a json
$.getJSON('/articles', function(data) {
  // for each one
  for (var i = 0; i<data.length; i++){
    // display the apropos information on the page
    $('#articles').append('<h3>' + data[i].title +'</h3>' + '<br>' +'<p class= "panel" data-id="' + data[i]._id + '">' + '<br />'+ data[i].paragraph + '<br />' +"<a href='http://www.cnn.com" + data[i].link + "'>"+ "Take me away!</a>" + '</p>' + '<br>');
  }
});


$(document).on('click', 'p', function(){
  $('#notes').empty();
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId,
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').append('<h3>' + data.title + '</h3>'); 
      $('#notes').append('<input id="titleinput" placeholder="Write title here.." name="title" >'); 
      $('#notes').append('<textarea id="bodyinput" placeholder="Write here.." name="body"></textarea>'); 
      $('#notes').append('<button data-id="' + data._id + '" id="savenote">Save Note</button>');

      if(data.note){
        $('#titleinput').val(data.note.title);
        $('#bodyinput').val(data.note.body);
      }
    });
});

$(document).on('click', '#savenote', function(){
  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(), 
      body: $('#bodyinput').val() 
    }
  })
    .done(function( data ) {
      console.log(data);
      $('#notes').empty();
    });

  $('#titleinput').val("");
  $('#bodyinput').val("");
});
