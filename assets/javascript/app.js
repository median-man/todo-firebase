// when user clicks add
// get input from the form
// add task to list
// clear form input

// Function to create new htlm element for a task and append it to the task list
function appendNewTask(text) {
  $('.list-group').append(
    '<li class="list-group-item"><div class="row"><div class="col-xs-9">' +
    '<span class="glyphicon glyphicon-unchecked"></span>' +
    $('<span>').text(' ' + text).html() +
    '</div><div class="col-xs-3"><span class="glyphicon glyphicon-edit pull-right">' +
    '</span></div></div></li>');
}
function addTask(event) {
  event.preventDefault();
  var $newTaskInput = $('#txtNewTask');
  var newTask = $newTaskInput.val().trim();
  $newTaskInput.val('');
  appendNewTask(newTask);
}

$(function onDocumentReady() {
  $('form').on('submit', addTask);
});