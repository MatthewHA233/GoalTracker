# 目标追踪器说明文档

## 项目简介

目标追踪器是一个基于 Electron 的桌面应用程序，灵感来源于 [ClockCn.com](https://clockcn.com/miaobiao/) 在线秒表。该应用程序旨在帮助用户更好地管理和追踪学习或工作目标的完成情况。

## 功能特点

1. **目标设置**
   - 可设置总任务数量
   - 自定义任务单位（如篇、道、个等）
   - 设定总体完成时间

2. **时间追踪**
   - 总时间计时器
   - 单任务计时器
   - 实时显示目标完成进度

3. **智能提示**
   - 超时警告（红色显示）
   - 达标提示（绿色显示）
   - 任务完成提醒

4. **数据记录**
   - 自动记录每个任务的完成时间
   - 显示累计用时
   - 任务完成历史记录

## 使用方法

1. **启动应用**
```bash
npm start
```

2. **设置目标**
   - 输入总任务数
   - 选择任务单位
   - 设定预期完成时间

3. **开始追踪**
   - 点击"开始追踪"按钮
   - 使用控制按钮（开始/暂停/重置）
   - 完成一个任务后点击"记录目标"

## 技术实现

主要代码实现参考：

```1:223:script.js
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
}
```


界面样式参考：

```1:154:styles.css
:root {
  --primary-color: #4a90e2;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  --text-color: #2c3e50;
  --bg-color: #f5f6fa;
  --card-bg: #ffffff;
}

body {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  max-width: 1000px;
  padding: 2rem;
}

.card {
  background: var(--card-bg);
  border: none;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.card-title {
  color: var(--primary-color);
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.timer {
  font-size: 3.5rem;
  font-weight: 300;
  transition: color 0.3s ease;
  font-variant-numeric: tabular-nums;
}

.timer-description {
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* 按钮样式 */
.btn {
  border-radius: 8px;
  padding: 0.6rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
}

.btn-success {
  background-color: var(--success-color);
}

.btn-warning {
  background-color: var(--warning-color);
}

.btn-danger {
  background-color: var(--danger-color);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* 表单样式 */
.form-control {
  border-radius: 8px;
  border: 2px solid #eee;
  padding: 0.7rem 1rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* 表格样式 */
.table {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0,0,0,0.05);
}

.table thead th {
  background-color: #f8f9fa;
  border-bottom: none;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table td {
  vertical-align: middle;
  border-top: 1px solid #f1f1f1;
  padding: 1rem;
}

/* 颜色指示器 */
.green-text {
  color: var(--success-color);
  font-weight: 500;
}

.red-text {
  color: var(--danger-color);
  font-weight: 500;
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

#tracker-card {
  animation: fadeIn 0.5s ease-out;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .timer {
    font-size: 2.5rem;
  }
  
  .btn {
    width: 100%;
    margin: 0.5rem 0;
  }
}
```


## 灵感来源

本项目的计时功能和界面设计灵感来源于 ClockCn.com 的在线秒表。我们注意到在线秒表网站提供了简洁的计时功能和清晰的数据记录，这对于学习和工作追踪非常有帮助。在此基础上，我们增加了：

- 目标管理功能
- 进度追踪
- 智能提示系统
- 数据统计分析

## 系统要求

- 操作系统：Windows/MacOS/Linux
- Node.js 版本：>= 14.0.0
- 内存要求：>= 4GB
- 硬盘空间：>= 100MB

## 注意事项

1. 首次使用需要进行目标设置
2. 建议定期保存进度
3. 可以随时暂停和继续
4. 支持任务重置功能

## 未来计划

1. 添加数据导出功能
2. 支持多任务并行追踪
3. 添加统计图表功能
4. 增加自定义主题
