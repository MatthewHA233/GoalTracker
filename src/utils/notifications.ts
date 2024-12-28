import { sendNotification } from '@tauri-apps/api/notification';

export async function showTaskCompletionNotification(totalTasks: number, measureWord: string, isAllCompleted: boolean) {
  await sendNotification({
    title: '目标完成',
    body: isAllCompleted 
      ? `恭喜完成所有 ${totalTasks} ${measureWord}！`
      : `已达到 ${totalTasks} ${measureWord}！`
  });
}