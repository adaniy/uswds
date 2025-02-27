const select = require("../../uswds-core/src/js/utils/select");
const behavior = require("../../uswds-core/src/js/utils/behavior");
const toggle = require("../../uswds-core/src/js/utils/toggle");
const isElementInViewport = require("../../uswds-core/src/js/utils/is-in-viewport");
const { CLICK } = require("../../uswds-core/src/js/events");
const { prefix: PREFIX } = require("../../uswds-core/src/js/config");

const ACCORDION = `.${PREFIX}-accordion, .${PREFIX}-accordion--bordered`;
const BUTTON = `.${PREFIX}-accordion__button[aria-controls]`;
const EXPANDED = "aria-expanded";
const MULTISELECTABLE = "data-allow-multiple";

/**
 * Get an Array of button elements belonging directly to the given
 * accordion element.
 * @param {HTMLElement} accordion
 * @return {array<HTMLButtonElement>}
 */
const getAccordionButtons = (accordion) => {
  const buttons = select(BUTTON, accordion);

  return buttons.filter((button) => button.closest(ACCORDION) === accordion);
};

/**
 * Toggle a button's "pressed" state, optionally providing a target
 * state.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean?} expanded If no state is provided, the current
 * state will be toggled (from false to true, and vice-versa).
 * @return {boolean} the resulting state
 */
const toggleButton = (button, expanded) => {
  const accordion = button.closest(ACCORDION);
  let safeExpanded = expanded;

  if (!accordion) {
    throw new Error(`${BUTTON} is missing outer ${ACCORDION}`);
  }

  safeExpanded = toggle(button, expanded);

  // XXX multiselectable is opt-in, to preserve legacy behavior
  const multiselectable = accordion.hasAttribute(MULTISELECTABLE);

  if (safeExpanded && !multiselectable) {
    getAccordionButtons(accordion).forEach((other) => {
      if (other !== button) {
        toggle(other, false);
      }
    });
  }
};

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} true
 */
const showButton = (button) => toggleButton(button, true);

/**
 * @param {HTMLButtonElement} button
 * @return {boolean} false
 */
const hideButton = (button) => toggleButton(button, false);

const accordion = behavior(
  {
    [CLICK]: {
      [BUTTON]() {
        toggleButton(this);

        if (this.getAttribute(EXPANDED) === "true") {
          // We were just expanded, but if another accordion was also just
          // collapsed, we may no longer be in the viewport. This ensures
          // that we are still visible, so the user isn't confused.
          if (!isElementInViewport(this)) this.scrollIntoView();
        }
      },
    },
  },
  {
    init(root) {
      // Check if Banner has previously initialized accordion.
      if (!this.hasInit) {
        select(BUTTON, root).forEach((button) => {
          const expanded = button.getAttribute(EXPANDED) === "true";
          toggleButton(button, expanded);
        });

        this.hasInit = true;
      }
    },
    teardown() {
      this.hasInit = false;
    },
    ACCORDION,
    BUTTON,
    show: showButton,
    hide: hideButton,
    toggle: toggleButton,
    getButtons: getAccordionButtons,
    hasInit: this.hasInit || false
  }
);

module.exports = accordion;
