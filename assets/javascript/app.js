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

// Function to update a task element
function renderTask(taskData) {
  var selector = '#' + taskData.key;
  var $li = $(selector);
  var $checkBox = $li.find('.glyphicon-unchecked', '.glyphicon-check');
  var $textSpan = $li.find('span').eq(1);
  var text = ' ' + taskData.text;

  // update the stored taskData
  $li.data(taskData);
  
  if (taskData.isComplete) {
    // place completed task text inside an s element and apply styles to li
    $textSpan.empty().append($('<s>').text(text));
    createGlyphicon('check').replaceAll($checkBox);
    $li.addClass('completed');
  } else {
    // update the text and style li
    $textSpan.empty().text(text);
    createGlyphicon('unchecked').replaceAll($checkBox);
    $li.removeClass('completed');
  }
}

// Function to create a bootstrap3 glpyhicon
function createGlyphicon(glyph) {
  return $('<span>').addClass('glyphicon glyphicon-' + glyph);
}

// Function to create new html element for a task and append it to the task list
function appendNewTask(newTask) {
  // place task inside an <s> element if task is completed
  var $textSpan = $('<span>');
  var text = ' ' + newTask.text;
  if (newTask.isComplete) {
    $('<s>').text(text).appendTo($textSpan);
  } else {
    $textSpan.text(text);
  }
  
  var $checkBox = newTask.isComplete ? createGlyphicon('check') : createGlyphicon('unchecked');
  var $editLi = $('<li>').append(createGlyphicon('edit'));
  var $trashLi = $('<li>').append(createGlyphicon('trash'));
  var $actionList = $('<ul>').addClass('list-inline').append($trashLi, $editLi);
  var $col1 = $('<div>').addClass('col-xs-10').append($checkBox, $textSpan);
  var $col2 = $('<div>').addClass('col-xs-2').append($actionList);
  var $row = $('<div>').addClass('row').append($col1, $col2);

  $('<li></li>', {
    class: 'list-group-item task' + (newTask.isComplete ? ' completed' : ''),
    id: newTask.key
  }).append($row)
    .appendTo('.list-group')
    // task data stored with li element
    .data(newTask);
}

// Function to get data stored in task element containing child element paremeter
function getTaskData(childEl) {
  return $(childEl).parents('li.task').data();
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
  task.delete(getTaskData(this).key);
}

// Function to toggle a task's isComplete state
function handleTaskCheckClick() {
  var taskData = getTaskData(this);
  task.update(taskData.key, false, !taskData.isComplete);
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
  var task = getTaskData(this);
  $('#txtUpdateTask').val(task.text).data(task);
  $('#editTaskModal').modal();
}

$(function onDocumentReady() {
  // set event listeners
  $(document).on('click', '.glyphicon-edit', showEditTaskModal);
  $(document).on('click', '.glyphicon-unchecked', handleTaskCheckClick);
  $(document).on('click', '.glyphicon-trash', handleDeleteTaskClick);
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
    renderTask({
      key: childSnap.key,
      text: childSnap.val().text,
      isComplete: childSnap.child('isComplete').exists()
    });
  });

  // when a task is removed from the database, remove it from the page
  tasksRef.on('child_removed', function (childSnap) {
    var selector = '#' + childSnap.key;
    $(selector).remove();
  });
});
