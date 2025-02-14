import React, {Component, PureComponent} from 'react'
import reactCSS from 'reactcss'

const DEFAULT_ARROW_OFFSET = 1

const UP_KEY_CODE = 38
const DOWN_KEY_CODE = 40
const VALID_KEY_CODES = [UP_KEY_CODE, DOWN_KEY_CODE]
const isValidKeyCode = keyCode => VALID_KEY_CODES.indexOf(keyCode) > -1
const getNumberValue = value => Number(String(value).replace(/%/g, ''))

let idCounter = 1

export class EditableInput extends (PureComponent || Component) {
  constructor(props) {
    super()

    this.state = {
      value: String(props.value).toUpperCase(),
      blurValue: String(props.value).toUpperCase(),
    }

    this.inputId = `rc-editable-input-${idCounter++}`
  }

  componentDidUpdate(prevProps, prevState) {
    if (
        this.props.value !== this.state.value &&
        (prevProps.value !== this.props.value || prevState.value !== this.state.value)
    ) {
      if (this.input === document.activeElement) {
        this.setState({ blurValue: String(this.props.value).toUpperCase() })
      } else {
        this.setState({
          value: String(this.props.value).toUpperCase(),
          blurValue: !this.state.blurValue && String(this.props.value).toUpperCase()
        })
      }
    }
  }

  componentWillUnmount() {
    this.unbindEventListeners()
  }

  /**
   * Returns an object with the label as key and the provided value.
   *
   * @param {number|string} value - The value to associate with the label.
   * @returns {Object} An object containing the label and value.
   */
  getValueObjectWithLabel(value) {
    return {
      [this.props.label]: value
    }
  }

  /**
   * Handles the input blur event by resetting the displayed value.
   */
  handleBlur = () => {
    if (this.state.blurValue) {
      this.setState({ value: this.state.blurValue, blurValue: null })
    }
  }

  /**
   * Handles the change event of the input.
   *
   * @param {Event} e - The event object.
   */
  handleChange = (e) => {
    this.setUpdatedValue(e.target.value, e)
  }

  /**
   * Retrieves the offset value used for arrow key adjustments.
   *
   * @returns {number} The arrow offset.
   */
  getArrowOffset() {
    return this.props.arrowOffset || DEFAULT_ARROW_OFFSET
  }

  /**
   * Handles key down events for adjusting the value with arrow keys.
   *
   * @param {KeyboardEvent} e - The keyboard event.
   */
  handleKeyDown = (e) => {
    const value = getNumberValue(e.target.value)
    if (!isNaN(value) && isValidKeyCode(e.keyCode)) {
      const offset = this.getArrowOffset()
      const updatedValue = e.keyCode === UP_KEY_CODE ? value + offset : value - offset

      this.setUpdatedValue(updatedValue, e)
    }
  }

  /**
   * Updates the value and triggers the onChange callback.
   *
   * @param {number|string} value - The new value.
   * @param {Event} e - The event object.
   */
  setUpdatedValue(value, e) {
    const onChangeValue = this.props.label ? this.getValueObjectWithLabel(value) : value
    this.props.onChange && this.props.onChange(onChangeValue, e)

    this.setState({ value })
  }

  /**
   * Handles the drag event by updating the value based on horizontal movement.
   * Prevents default browser behavior to avoid unintended actions.
   *
   * @param {MouseEvent} e - The mouse event triggered during dragging.
   */
  handleDrag = (e) => {
    e.preventDefault()
    if (this.props.dragLabel) {
      const newValue = Math.round(this.props.value + e.movementX)
      if (newValue >= 0 && newValue <= this.props.dragMax) {
        this.props.onChange && this.props.onChange(this.getValueObjectWithLabel(newValue), e)
      }
    }
  }

  /**
   * Initiates the drag event, adding necessary event listeners.
   *
   * @param {MouseEvent} e - The mouse down event.
   */
  handleMouseDown = (e) => {
    if (this.props.dragLabel) {
      e.preventDefault()
      this.handleDrag(e)
      window.addEventListener('mousemove', this.handleDrag)
      window.addEventListener('mouseup', this.handleMouseUp)
    }
  }

  /**
   * Ends the drag event by removing event listeners.
   */
  handleMouseUp = () => {
    this.unbindEventListeners()
  }

  /**
   * Removes mouse event listeners for dragging.
   */
  unbindEventListeners = () => {
    window.removeEventListener('mousemove', this.handleDrag)
    window.removeEventListener('mouseup', this.handleMouseUp)
  }

  render() {
    const styles = reactCSS({
      'default': {
        wrap: {
          position: 'relative',
        },
      },
      'user-override': {
        wrap: this.props.style && this.props.style.wrap ? this.props.style.wrap : {},
        input: this.props.style && this.props.style.input ? this.props.style.input : {},
        label: this.props.style && this.props.style.label ? this.props.style.label : {},
      },
      'dragLabel-true': {
        label: {
          cursor: 'ew-resize',
        },
      },
    }, {
      'user-override': true,
    }, this.props)

    return (
      <div style={ styles.wrap }>
        <input
          id={ this.inputId }
          style={ styles.input }
          ref={ input => this.input = input }
          value={ this.state.value }
          onKeyDown={ this.handleKeyDown }
          onChange={ this.handleChange }
          onBlur={ this.handleBlur }
          placeholder={ this.props.placeholder }
          spellCheck="false"
        />
        { this.props.label && !this.props.hideLabel ? (
          <label
            htmlFor={ this.inputId }
            style={ styles.label }
            onMouseDown={ this.handleMouseDown }
          >
            { this.props.label }
          </label>
        ) : null }
      </div>
    )
  }
}

export default EditableInput
