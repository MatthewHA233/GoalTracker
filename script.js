document.addEventListener('DOMContentLoaded', function() {
  const goalForm = document.getElementById('goal-form');
  const trackerCard = document.getElementById('tracker-card');
  const totalTasksInput = document.getElementById('total-tasks');
  const measureWordInput = document.getElementById('measure-word');
  const totalTimeInput = document.getElementById('total-time');
  const totalTimerDisplay = document.getElementById('total-timer');
  const taskTimerDisplay = document.getElementById('task-timer');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const resetBtn = document.getElementById('reset-btn');
  const recordTaskBtn = document.getElementById('record-task-btn');
  const taskTableBody = document.getElementById('task-table-body');
  const totalTimeTargetDisplay = document.getElementById('total-time-target-display');
  const averageTaskTimeDisplay = document.getElementById('average-task-time-display');

  let totalTasks = 0;
  let measureWord = '篇';
  let totalTime = 0; // 总时间（分钟）
  let totalElapsedTime = 0; // 总计时器（秒）
  let taskElapsedTime = 0; // 当前任务计时器（秒）
  let timerInterval = null;
  let taskCount = 0;
  let taskTimes = [];
  let averageTimePerTask = 0; // 单个任务平均时间（秒）

  // 表单提交处理
  goalForm.addEventListener('submit', function(e) {
    e.preventDefault();
    totalTasks = parseInt(totalTasksInput.value);
    measureWord = measureWordInput.value.trim() || '篇';
    totalTime = parseInt(totalTimeInput.value);

    if (totalTasks <= 0 || totalTime <= 0) {
      alert('请输入有效的任务数和时间。');
      return;
    }

    averageTimePerTask = (totalTime * 60) / totalTasks; // 计算平均每个任务的时间（秒）

    // 更新目标信息
    // 初始总时间目标设置为 averageTimePerTask *1
    totalTimeTargetDisplay.textContent = formatTime(averageTimePerTask * 1);
    averageTaskTimeDisplay.textContent = formatTime(averageTimePerTask);

    // 重置状态
    totalElapsedTime = 0;
    taskElapsedTime = 0;
    taskCount = 0;
    taskTimes = [];
    taskTableBody.innerHTML = '';

    // 显示追踪器卡片
    trackerCard.style.display = 'block';

    // 设置按钮状态
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    recordTaskBtn.disabled = true;

    updateTimerDisplay();
    updateTimerColors();
  });

  // 开始按钮事件
  startBtn.addEventListener('click', function() {
    if (!timerInterval) {
      timerInterval = setInterval(() => {
        totalElapsedTime++;
        taskElapsedTime++;
        updateTimerDisplay();
        updateTimerColors();
      }, 1000);
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      resetBtn.disabled = false;
      recordTaskBtn.disabled = false;
    }
  });

  // 暂停按钮事件
  pauseBtn.addEventListener('click', function() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  });

  // 重置按钮事件
  resetBtn.addEventListener('click', function() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    totalElapsedTime = 0;
    taskElapsedTime = 0;
    taskCount = 0;
    taskTimes = [];
    taskTableBody.innerHTML = '';
    trackerCard.style.display = 'none';
    goalForm.reset();
    totalTimeTargetDisplay.textContent = '00:00:00';
    averageTaskTimeDisplay.textContent = '00:00:00';
  });

  // 记录任务按钮事件
  recordTaskBtn.addEventListener('click', function() {
    if (taskCount >= totalTasks) {
      alert(`已达到 ${totalTasks} ${measureWord}！`);
      return;
    }

    const currentTotalTime = totalElapsedTime;
    const singleTaskTime = taskElapsedTime;
    taskElapsedTime = 0; // 重置任务计时器
    taskCount++;
    taskTimes.push(singleTaskTime);

    // 计算新的总时间目标
    const newTotalTimeTargetSeconds = averageTimePerTask * (taskCount + 1);
    totalTimeTargetDisplay.textContent = formatTime(newTotalTimeTargetSeconds);

    // 创建任务项
    const taskItem = document.createElement('tr');

    // 任务编号
    const taskNumber = document.createElement('td');
    taskNumber.textContent = `第${taskCount}${measureWord}`;
    taskItem.appendChild(taskNumber);

    // 单个任务时间
    const singleTime = document.createElement('td');
    singleTime.textContent = formatTime(singleTaskTime);
    // 比较单个任务时间与平均时间
    if (singleTaskTime > averageTimePerTask) {
      singleTime.classList.add('red-text');
    } else {
      singleTime.classList.add('green-text');
    }
    taskItem.appendChild(singleTime);

    // 完成时总时间
    const totalTimeAtCompletion = document.createElement('td');
    totalTimeAtCompletion.textContent = formatTime(currentTotalTime);
    // 比较总时间与允许总时间
    if (currentTotalTime > newTotalTimeTargetSeconds) {
      totalTimeAtCompletion.classList.add('red-text');
    } else {
      totalTimeAtCompletion.classList.add('green-text');
    }
    taskItem.appendChild(totalTimeAtCompletion);

    // 将任务插入到列表顶部
    if (taskTableBody.firstChild) {
      taskTableBody.insertBefore(taskItem, taskTableBody.firstChild);
    } else {
      taskTableBody.appendChild(taskItem);
    }

    // 检查是否达到总任务数
    if (taskCount >= totalTasks) {
      pauseTimer();
      recordTaskBtn.disabled = true;
      alert(`已完成所有 ${totalTasks} ${measureWord}！`);
    }

    updateTimerColors();
  });

  // 暂停计时器函数
  function pauseTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }
  }

  // 更新秒表显示
  function updateTimerDisplay() {
    totalTimerDisplay.textContent = formatTime(totalElapsedTime);
    taskTimerDisplay.textContent = formatTime(taskElapsedTime);
  }

  // 格式化时间函数
  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  // 补零函数
  function pad(num) {
    return num.toString().padStart(2, '0');
  }

  // 更新秒表颜色
  function updateTimerColors() {
    // 计算当前允许的总时间
    const allowedTotalSeconds = averageTimePerTask * (taskCount + 1);
    if (totalElapsedTime > allowedTotalSeconds) {
      totalTimerDisplay.classList.remove('green-text');
      totalTimerDisplay.classList.add('red-text');
    } else {
      totalTimerDisplay.classList.remove('red-text');
      totalTimerDisplay.classList.add('green-text');
    }

    // 更新当前任务时间计时器颜色
    if (taskElapsedTime > averageTimePerTask) {
      taskTimerDisplay.classList.remove('green-text');
      taskTimerDisplay.classList.add('red-text');
    } else {
      taskTimerDisplay.classList.remove('red-text');
      taskTimerDisplay.classList.add('green-text');
    }
  }
});
