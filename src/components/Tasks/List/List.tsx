import React, { memo, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import Loader from 'components/Loader';
import Tabs from 'components/Tabs';
import TaskItem from 'components/Tasks/Task';
import { Task } from 'store/tasks/tasks.types';

import style from './List.module.scss';

interface ListProps {
  tasks: Task[] | null;
  loading: boolean;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
}

const List: React.FC<ListProps> = ({ tasks: propsTasks, loading, onDelete, onComplete }) => {
  const { t } = useTranslation(['tabs', 'tasks']);

  const tabs = useMemo(
    () => [
      { value: t('all'), tasks: propsTasks },
      { value: t('important'), tasks: propsTasks?.filter(({ important }) => important) },
      { value: t('complete'), tasks: propsTasks?.filter(({ complete }) => complete) },
    ],
    [t, propsTasks]
  );

  return (
    <>
      {loading && <Loader size="lg" mode="circle" classNames={style.tasksLoading} />}
      <Tabs.Container active={t('all')}>
        {tabs.map(({ value, tasks }) => (
          <Tabs.Content key={value} value={value}>
            {tasks?.length ? (
              <ul className={style.ul}>
                {tasks.map(task => (
                  <li className={style.li} key={task.id}>
                    <TaskItem onDelete={onDelete} onComplete={onComplete} task={task} />
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t('tasks:empty')}</p>
            )}
          </Tabs.Content>
        ))}
      </Tabs.Container>
    </>
  );
};

export default memo(List);
