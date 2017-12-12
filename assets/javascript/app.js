// database globals
var database = firebase.database();
var tasksRef = database.ref('/tasks');

var task = {
  create: function createNewTask(text) {
    var newTaskRef = tasksRef.push(text);
    return {
      key: newTaskRef.key, // keep things es5 compatible
      text: text
    };
  },
  // method deletes task from database and returns promise
  delete: function deleteTask(key) {
    return tasksRef.child(key).remove();
  },
  // method updates task from the database and returns promise
  // passing an object with the key and new text
  update: function updateTask(key, text) {
    return tasksRef
      .child(key)
      .set(text)
      .then(function () {
        return { key: key, text: text };
      });
  }
};

// Function to create new html element for a task and append it to the task list
function appendNewTask(newTask) {
  var $checkBox = $('<span>', {
    class: 'glyphicon glyphicon-unchecked',
    data: newTask
  });
  // give the span holding the text of the task an id equal to the key
  var $textSpan = $('<span>').attr('id', newTask.key).text(' ' + newTask.text);
  var $edit = $('<span>').addClass('glyphicon glyphicon-edit pull-right').data(newTask);
  var $col1 = $('<div>').addClass('col-xs-9').append($checkBox, $textSpan);
  var $col2 = $('<div>').addClass('col-xs-3').append($edit);
  var $row = $('<div>').addClass('row').append($col1, $col2);
  return $('<li class="list-group-item"></li>').append($row).appendTo('.list-group');
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
    .then(function deleteTaskElement() {
      // remove the task from the page
      $('#' + key).parents('li').remove();
    });
}

function handleEditTaskFormSubmit(event) {
  event.preventDefault();
  var $input = $('#txtUpdateTask');
  var key = $input.data().key;
  var text = $input.val().trim();

  // update the task if the text was changed
  if (text !== $input.data().text) task.update(key, text);

  // hide the modal
  $('#editTaskModal').modal('hide');
}

// Function to handle click on an edit element for a task
function handleEditTaskClick() {
  // populate form with task data
  var task = $(this).data();
  $('#txtUpdateTask').val(task.text).data(task);

  // display a form to edit the task
  $('#editTaskModal').modal();
  // when user clicks ok

  $('#editTaskForm').data(task).on('submit', handleEditTaskFormSubmit);
}

// set event listeners
$(document).on('click', '.glyphicon-edit', handleEditTaskClick);
$(document).on('click', '.glyphicon-unchecked', handleTaskCheckClick);
$(function onDocumentReady() {
  $('#addTaskForm').on('submit', handleAddTaskFormSubmit);

  // append task to page when added to database
  tasksRef.on('child_added', function handleTaskAdded(childSnap) {
    appendNewTask({ key: childSnap.key, text: childSnap.val() });

    // render any changes to the task data
    childSnap.ref.on('value', function (snap) {
      // update the displayed text if snap wasn't deleted
      if (snap.val()) $('#' + snap.key).text(' ' + snap.val());
    });
  });
});
