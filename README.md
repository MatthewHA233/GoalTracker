# 目标追踪器 (Goal Tracker)

一个基于 React + TypeScript + Tauri 开发的现代化桌面应用程序,帮助你追踪和管理学习、工作目标的完成进度。

## 特性

### 🎯 精确的目标设置
- 自定义任务数量和单位
- 灵活设置总体完成时间
- 智能计算单任务平均用时

### ⏱️ 专业的时间追踪
- 高精度计时器 (精确到毫秒)
- 总时间与单任务时间同步显示
- 数字时钟风格界面

### 📊 实时的数据统计
- 任务完成历史记录
- 单任务用时分析
- 总体进度追踪

### 🔔 智能的状态提醒
- 任务超时警告
- 目标完成提示
- 进度达标反馈

## 快速开始

1. 安装依赖
```bash
pnpm install
```

2. 开发模式
```bash
pnpm dev
```

3. 构建应用
```bash
pnpm build
```

## 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **构建工具**: Vite
- **桌面框架**: Tauri
- **样式方案**: Tailwind CSS
- **图标库**: Lucide Icons

## 系统要求

- **操作系统**: Windows / macOS / Linux
- **Node.js**: >= 16.0.0
- **内存**: >= 4GB
- **存储空间**: >= 200MB

## 开发指南

### 项目结构
```
goal-tracker/
├── src/
│   ├── components/     # React组件
│   ├── utils/         # 工具函数
│   ├── types/         # TypeScript类型
│   └── App.tsx        # 应用入口
├── public/            # 静态资源
└── package.json       # 项目配置
```

### 核心组件

1. **GoalForm**: 目标设置表单
```typescript:src/components/GoalForm.tsx
startLine: 15
endLine: 67
```

2. **Timer**: 计时器组件
```typescript:src/components/Timer.tsx
startLine: 19
endLine: 134
```

3. **TaskList**: 任务列表
```typescript:src/components/TaskList.tsx
startLine: 11
endLine: 54
```

## 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 未来规划

- [ ] 数据持久化存储
- [ ] 多任务并行追踪
- [ ] 数据可视化图表
- [ ] 自定义主题支持
- [ ] 导出统计报告

## 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解更多详情

## 致谢

- 灵感来源于 [ClockCn.com](https://clockcn.com/miaobiao/)
- 使用 [Tauri](https://tauri.app/) 构建桌面应用
- 采用 [Tailwind CSS](https://tailwindcss.com/) 构建界面