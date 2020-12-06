import React, { useMemo, useRef, memo, useCallback } from 'react';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { AiOutlineClose } from 'react-icons/ai';
import * as Yup from 'yup';

import Button from 'components/Common/Button';
import { Input, Checkbox, Label, Wysiwyg } from 'components/Common/Fileds';
import { useClickOutside } from 'hooks';
import { Task } from 'store/tasks/tasks.types';
import { useTheme } from 'theme/theme';

import { useStyles } from './Form.styles';

export interface TaskFormFields {
  title: string;
  description: string;
  important: boolean;
}

const initial = {
  title: '',
  description: '',
  important: false,
};

export interface FormProps {
  task?: Task | null;
  mode: 'create' | 'edit';
  onSubmit: (values: TaskFormFields) => void;
  loading?: boolean;
  onClose: () => void;
}

const makeInitialValues = (mode: 'create' | 'edit', task?: Task | null) => {
  if (task && mode === 'edit') {
    return {
      title: task.title,
      description: task.description.toString(),
      important: task.important,
    };
  }

  return initial;
};

const Form: React.FC<FormProps> = ({ onSubmit, onClose, mode, task, loading }) => {
  const theme = useTheme();
  const classes = useStyles({ theme });

  const { t } = useTranslation(['tasks', 'buttons', 'errorMessages']);
  const divElement = useRef<HTMLDivElement>(null);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape<Omit<TaskFormFields, 'important'>>({
        title: Yup.string().required(t('errorMessages:required')),
        description: Yup.string().required(t('errorMessages:required')),
      }),
    [t]
  );

  const formik = useFormik<TaskFormFields>({
    initialValues: makeInitialValues(mode, task),
    validationSchema,
    onSubmit,
  });

  const handleWysiwygChange = useCallback(
    (value: string) => {
      const target = { value, name: 'description' };
      formik.handleChange({ target } as React.ChangeEvent<HTMLInputElement>);
    },
    [formik]
  );

  useClickOutside(divElement, onClose);

  return (
    <section className={classes.container}>
      <div ref={divElement} className={classes.formWrapper}>
        <Button onClick={onClose} type="button" className={classes.close} mode="icon">
          <AiOutlineClose />
        </Button>

        <form onSubmit={formik.handleSubmit} className={classes.form}>
          <Label
            title={t('formTitle')}
            name="title"
            touched={formik.touched.title}
            error={formik.errors.title}
          >
            <Input
              name="title"
              id="title"
              type="text"
              maxLength={40}
              touched={formik.touched.title}
              error={formik.errors.title}
              value={formik.values.title}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
            />
          </Label>

          <Wysiwyg
            label={t('formDescription')}
            value={formik.values.description}
            onChange={handleWysiwygChange}
            touched={formik.touched.description}
            error={formik.errors.description}
          />

          <Checkbox
            name="important"
            title={t('formCheckbox')}
            checked={formik.values.important}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />

          <Button type="submit" disabled={loading} loading={loading}>
            {t('buttons:submit')}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default memo(Form);