import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { omit, reduce, get } from 'lodash/fp';

export const FORM_CONTEXT = {
  form: PropTypes.shape({
    data: PropTypes.object,
    country: PropTypes.string,
    onChange: PropTypes.func,
    onFieldChange: PropTypes.func,
    onSubmit: PropTypes.func
  }).isRequired
};

export function createFormState(
  fields,
  initialValues = {
    values: {},
    meta: {},
    metaPaths: {},
    validations: {},
    messages: {}
  }
) {
  return reduce(
    (memo, field) => {
      const { values, metaPaths, validations, messages } = initialValues;
      memo.values[field] = get(field, '', values);
      memo.errors[field] = {};
      memo.dirty[field] = false;
      memo.meta[field] = {};
      memo.metaPaths[field] = get(field, '', metaPaths);
      memo.validations[field] = get(field, {}, validations);
      memo.messages[field] = get(field, {}, messages);
      return memo;
    },
    {
      values: {},
      errors: {},
      dirty: {},
      meta: {},
      metaPaths: {},
      validations: {},
      messages: {},
      valid: false
    },
    fields
  );
}

export function mergeFormValues(data, values) {
  return { ...data, values: { ...data.values, ...values } };
}

export default class Form extends Component {
  static childContextTypes = FORM_CONTEXT;
  static propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    country: PropTypes.string
  };

  submitCallbacks = [];

  getChildContext() {
    const { data, onChange, country } = this.props;
    return {
      form: {
        data,
        onChange,
        country,
        onFieldChange: field => e => {
          e.stopPropagation();
          const nextData = {
            ...data,
            values: { ...data.values, [field]: e.target.value },
            dirty: { ...data.dirty, [field]: true },
            errors: { ...data.errors }
          };
          onChange(nextData);
        },
        onSubmit: cb => {
          this.submitCallbacks.push(cb);
          return () => {
            const index = this.submitCallbacks.indexOf(cb);
            if (index !== -1) {
              this.submitCallbacks.splice(index, 1);
            }
          };
        }
      }
    };
  }

  render() {
    const { onSubmit, children, ...other } = this.props;
    const propsToOmit = ['onChange', 'onSetErrors', 'data', 'country'];
    const formProps = omit(propsToOmit, other);
    const wrappedOnSubmit = e => {
      const res = onSubmit(e);
      this.submitCallbacks.forEach(cb => cb(res));
    };

    return (
      <form autoComplete="off" onSubmit={wrappedOnSubmit} {...formProps}>
        {children}
      </form>
    );
  }
}