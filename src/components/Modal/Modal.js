import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import { injectGlobal, css, cx } from 'react-emotion';
import { withTheme } from 'emotion-theming';
import { transparentize } from 'polished';

import Card, { CardHeader, CardFooter } from '../Card';
import Heading from '../Heading';
import { themePropType } from '../../util/shared-prop-types';
import { mapValues } from '../../util/fp';
import IS_IOS from '../../util/ios';

export const TRANSITION_DURATION = 200;
export const DEFAULT_APP_ELEMENT = '#root';
export const APP_ELEMENT_PROP_TYPE = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.node
]);

const TOP_MARGIN = '10vh';
const TRANSFORM_Y_FLOATING = '10vh';
const FLOATING_TRANSITION = `${TRANSITION_DURATION}ms ease-in-out`;
// eslint-disable-next-line max-len
const FIXED_TRANSITION = `${TRANSITION_DURATION}ms cubic-bezier(0, 0.37, 0.64, 1)`;

/**
 * React Modal styles.
 * Documentation: http://reactcommunity.org/react-modal/styles/classes.html
 */

const cardStyles = ({ theme }) => css`
  width: 100%;

  ${theme.mq.untilKilo`
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    min-width: initial;
    position: relative;
  `};
`;

const modalClassName = {
  base: ({ theme }) => css`
    label: modal;
    outline: none;

    ${theme.mq.untilKilo`
      bottom: 0;
      max-height: 80vh;
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      position: fixed;
      transform: translateY(100%);
      transition: transform ${FIXED_TRANSITION};
      width: 100%;
      width: 100vw;
    `};

    ${theme.mq.kilo`
      transition: transform ${FLOATING_TRANSITION},
        opacity ${FLOATING_TRANSITION};
      margin: ${TOP_MARGIN} auto auto;
      max-height: 90vh;
      max-width: 90%;
      min-width: 450px;
      opacity: 0;
      position: relative;
      transform: translateY(${TRANSFORM_Y_FLOATING});
    `};

    ${theme.mq.mega`
      max-width: 750px;
    `};

    ${theme.mq.giga`
      max-width: 850px;
    `};
  `,
  afterOpen: ({ theme }) => css`
    label: modal--after-open;
    ${theme.mq.untilKilo`
      transform: translateY(0);
    `};

    ${theme.mq.kilo`
      opacity: 1;
      transform: translateY(0);
    `};
  `,
  /* eslint-disable max-len */
  beforeClose: ({ theme }) => css`
    label: modal--before-close;
    ${theme.mq.untilKilo`
       transform: translateY(100%);
    `};

    ${theme.mq.kilo`
       opacity: 0;
       transform: translateY(${TRANSFORM_Y_FLOATING});
    `};
  `
  /* eslint-enable max-len */
};

const overlayClassName = {
  base: ({ theme }) => css`
    label: modal__overlay;
    background: ${transparentize(0.84, theme.colors.shadow)};
    bottom: 0;
    left: 0;
    opacity: 0;
    position: fixed;
    right: 0;
    top: 0;
    transition: opacity 200ms ease-in-out;
    z-index: 1000;

    ${theme.mq.kilo`
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
    `};
  `,
  afterOpen: () => css`
    label: modal__overlay--after-open;
    opacity: 1;
  `,
  beforeClose: () => css`
    label: modal__overlay--before-close;
    opacity: 0;
  `
};

/**
 * Global body styles
 */

/* eslint-disable no-unused-expressions */
injectGlobal`
   /* Remove scroll on the body when react-modal is open */
  .ReactModal__Body--open {
    height: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: auto;
    width: 100vw;
    /* Supposed to prevent scrolling and maintaining scroll
     * position on iOS as per this Issue:
     * https://github.com/reactjs/react-modal/issues/191
     * Default solution would be to set position: fixed;
     * but that still scrolls to the top and requires
     * scrolling back to the original scroll position
     * onClose. Nasty hack and we don't want that.
     */
    ${IS_IOS ? 'position: absolute;' : ''};
  }
`;
/* eslint-enable no-unused-expressions */

/**
 * Circuit UI's wrapper component for ReactModal. Uses the Card component
 * to wrap content passed as the children prop. Don't forget to set
 * the aria prop when using this.
 * http://reactcommunity.org/react-modal/accessibility/#aria
 */
const Modal = ({
  children,
  className,
  onClose,
  contentLabel,
  theme,
  title,
  hasCloseButton,
  buttons,
  appElement,
  ...otherProps
}) => {
  ReactModal.setAppElement(appElement);
  const getClassValues = mapValues(styleFn => styleFn({ theme }));
  const reactModalProps = {
    ...otherProps,
    className: getClassValues(modalClassName),
    overlayClassName: getClassValues(overlayClassName),
    contentLabel,
    onRequestClose: onClose,
    closeTimeoutMS: TRANSITION_DURATION
  };

  return (
    <ReactModal {...reactModalProps}>
      <Card
        className={cx(cardStyles({ theme }), className)}
        shadow={Card.TRIPLE}
      >
        {(title || hasCloseButton) && (
          <CardHeader onClose={hasCloseButton ? onClose : null}>
            {title && (
              <Heading size={Heading.KILO} noMargin>
                {title}
              </Heading>
            )}
          </CardHeader>
        )}
        {children ? children({ onClose }) : null}
        {buttons && <CardFooter>{buttons({ onClose })}</CardFooter>}
      </Card>
    </ReactModal>
  );
};

Modal.propTypes = {
  /**
   * Render prop for the content of the Modal.
   */
  children: PropTypes.func.isRequired,
  /**
   * Determines if the modal is visible or not.
   */
  isOpen: PropTypes.bool.isRequired,
  /**
   * Function to close the modal. Passed down to the children
   * render prop.
   */
  onClose: PropTypes.func.isRequired,
  /**
   * The Circuit UI theme.
   */
  theme: themePropType.isRequired,
  /*
   * Heading to be shown at the top of the modal.
   */
  title: PropTypes.string,
  /*
   * A render prop rendering buttons. If you use multiple buttons,
   * wrap them in a ButtonGroup.
   */
  buttons: PropTypes.func,
  /*
   * Whether a close button (x) should be shown in the top right.
   */
  hasCloseButton: PropTypes.bool,
  /**
   * Class name string to overwrite the default
   * Card styles. Useful for removing padding from
   * the Card.
   */
  className: PropTypes.string,
  /**
   * React Modal's accessibility string.
   */
  contentLabel: PropTypes.string,
  /**
   * The element that should be used as root for the
   * React portal used to display the modal. See
   * http://reactcommunity.org/react-modal/accessibility/#app-element
   */
  appElement: APP_ELEMENT_PROP_TYPE
};

Modal.defaultProps = {
  className: '',
  contentLabel: 'Modal',
  title: null,
  hasCloseButton: true,
  buttons: null,
  appElement: DEFAULT_APP_ELEMENT
};

/**
 * @component
 */
export default withTheme(Modal);
