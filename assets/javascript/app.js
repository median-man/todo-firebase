// database globals
var database = firebase.database();
var tasksRef = database.ref('/tasks');

var task = {
  create: function createNewTask(text) {
    var newTaskRef = tasksRef.push({ text: text });
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
  update: function updateTask(key, text, isComplete) {
    var data = {};
    if (text) data.text = text;
    if (isComplete) data.isComplete = true;
    return tasksRef
      .child(key)
      .update(data)
      .then(function () {
        data.key = key;
        return data;
      });
  }
};

// Function to create new html element for a task and append it to the task list
function appendNewTask(newTask) {
  var $checkBox = $('<span>', {
    class: 'glyphicon glyphicon-unchecked',
    data: newTask
  });
  // use the key of the task as the id for the span holding the text
  var $textSpan = $('<span>').attr('id', newTask.key).text(' ' + newTask.text);
  var $edit = $('<span>').addClass('glyphicon glyphicon-edit pull-right').data(newTask);
  var $col1 = $('<div>').addClass('col-xs-9').append($checkBox, $textSpan);
  var $col2 = $('<div>').addClass('col-xs-3').append($edit);
  var $row = $('<div>').addClass('row').append($col1, $col2);
  return $('<li class="list-group-item"></li>').append($row).appendTo('.list-group');
}

// Function to update a task element
function renderTask(key, text, isComplete) {
  var selector = '#' + key;
  text = ' ' + text;
  
  if (isComplete) {
    // place completed task text inside an s element and apply class
    $(selector)
      .empty()
      .append($('<s>').text(text))
      .parents('li')
      .addClass('completed')
      // toggle checked icon
      .find('glyphicon-unchecked')
      .removeClass('glyphicon-unchecked')
      .addClass('glyphicon-checked');
  } else {
    // update the text
    $(selector).text(' ' + text);
  }
}

// Function adds user input from add task form
function handleAddTaskFormSubmit(event) {
  event.preventDefault();
  var $newTaskInput = $('#txtNewTask');
  var newTask = $newTaskInput.val().trim();
  $newTaskInput.val('');
  task.create(newTask);
}

// Function to handle remove task clicked by user
function handleDeleteTaskClick() {
  var key = $(this).data('key');
  task.delete(key);
}

// Function to toggle a task's isComplete state
function handleTaskCheckClick() {
  var key = $(this).data('key');
  var isComplete = !$(this).hasClass('glyphicon-checked');
  task.update(key, false, isComplete);
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

// Function shows the edit task modal
function showEditTaskModal() {
  // populate form with task data and show modal
  var task = $(this).data();
  $('#txtUpdateTask').val(task.text).data(task);
  $('#editTaskModal').modal();
}

$(function onDocumentReady() {
  // set event listeners
  $(document).on('click', '.glyphicon-edit', showEditTaskModal);
  $(document).on('click', '.glyphicon-unchecked', handleTaskCheckClick);
  $('#addTaskForm').on('submit', handleAddTaskFormSubmit);
  $('#editTaskForm').data(task).on('submit', handleEditTaskFormSubmit);

  // append task to page when added to database
  tasksRef.on('child_added', function (childSnap) {
    var taskData = childSnap.val();
    taskData.key = childSnap.key;
    appendNewTask(taskData);
  });

  // if a task's data is changed, update it on the page
  tasksRef.on('child_changed', function (childSnap) {
    console.log(childSnap.key, childSnap.val());
    renderTask(childSnap.key, childSnap.val().text, childSnap.child('isComplete').exists());
  });

  // when a task is removed from the database, remove it from the page
  tasksRef.on('child_removed', function (childSnap) {
    var selector = '#' + childSnap.key;
    $(selector).parents('li').remove();
  });
});
