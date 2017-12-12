// database globals
var database = firebase.database();
var tasksRef = database.ref('/tasks');

var task = {
  create: function createNewTask(text) {
    var key = tasksRef.push(text).key;
    return {
      key: key, // keep things es5 compatible
      text: text
    };
  },
  // method deletes task from database and returns promise
  delete: function deleteTask(key) {
    return tasksRef.child(key).remove();
  }
};

// Function to create new html element for a task and append it to the task list
function appendNewTask(newTask) {
  var $checkBox = $('<span>', {
    class: 'glyphicon glyphicon-unchecked',
    data: newTask
  });
  var $textSpan = $('<span>').text(' ' + newTask.text);
  var $edit = $('<span>').addClass('glyphicon glyphicon-edit pull-right').data(newTask);
  var $col1 = $('<div>').addClass('col-xs-9').append($checkBox, $textSpan);
  var $col2 = $('<div>').addClass('col-xs-3').append($edit);
  var $row = $('<div>').addClass('row').append($col1, $col2);
  return $('<li class="list-group-item"></li>')
    .attr('id', newTask.key)
    .append($row)
    .appendTo('.list-group');
}

// Function adds user input from add task form and clears the form.
function handleAddTaskFormSubmit(event) {
  event.preventDefault();
  var $newTaskInput = $('#txtNewTask');
  var newTask = $newTaskInput.val().trim();
  $newTaskInput.val('');
  task.create(newTask);
}

// Function to handle click on task check box
function handleTaskCheckClick() {
  // remove the task from the database for the key
  var key = $(this).data('key');
  task
    .delete(key)

    // remove task from list once task has been removed from database
    .then(function deleteTaskElement() {
      $('#' + key).remove();
    });
}

// Function to handle click on an edit element for a task
function handleEditTaskClick() {
  // when the user clicks on an edit button
  // get the id for the task that was clicked
  // display a form to edit the task
  // when user clicks ok
  // update the task and close the form
  // when user clicks cancel
  // close the form without updating the task
  console.log(this);
}

// set event listeners
$(document).on('click', '.glyphicon-edit', handleEditTaskClick);
$(document).on('click', '.glyphicon-unchecked', handleTaskCheckClick);
$(function onDocumentReady() {
  $('form').on('submit', handleAddTaskFormSubmit);

  // append task to page when added to database
  tasksRef.on('child_added', function handleTaskAdded(childSnap) {
    appendNewTask({ key: childSnap.key, text: childSnap.val() });
  });
});

// when check mark is click
// get the key of the clicked task
// remove the task from the database for the key
// remove task from list once task has been removed
