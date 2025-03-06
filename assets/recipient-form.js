if (!customElements.get('recipient-form')) {

  /*
  * let subscribers = {};
  * function subscribe(eventName, callback) {
  * 	if (subscribers[eventName] === undefined) {
  * 		subscribers[eventName] = [];
  * 	}
  * 
  * 	subscribers[eventName] = [...subscribers[eventName], callback];
  * 
  * 	return function unsubscribe() {
  * 		subscribers[eventName] = subscribers[eventName].filter((cb) => cb !== callback);
  * 	};
  * }
  */

  customElements.define(
    'recipient-form',
    class RecipientForm extends HTMLElement {
      constructor() {
        super();
        this.recipientFieldsLiveRegion = this.querySelector(`#Recipient-fields-live-region-${this.dataset.sectionId}`);
        this.checkboxInput = this.querySelector(`#Recipient-checkbox-${this.dataset.sectionId}`);
        this.checkboxInput.disabled = false;
        this.hiddenControlField = this.querySelector(`#Recipient-control-${this.dataset.sectionId}`);
        this.hiddenControlField.disabled = true;
        this.emailInput = this.querySelector(`#Recipient-email-${this.dataset.sectionId}`);
        this.nameInput = this.querySelector(`#Recipient-name-${this.dataset.sectionId}`);
        this.messageInput = this.querySelector(`#Recipient-message-${this.dataset.sectionId}`);
        this.sendonInput = this.querySelector(`#Recipient-send-on-${this.dataset.sectionId}`);
        this.offsetProperty = this.querySelector(`#Recipient-timezone-offset-${this.dataset.sectionId}`);
        if (this.offsetProperty) this.offsetProperty.value = new Date().getTimezoneOffset().toString();

        this.errorMessageWrapper = this.querySelector('.error-message-wrapper');
        this.errorMessageList = this.errorMessageWrapper?.querySelector('ul');
        this.defaultErrorHeader = this.errorMessageWrapper?.querySelector('.error-header')?.innerText || "Error";

        this.currentProductVariantId = this.dataset.productVariantId;
        this.addEventListener('change', this.onChange.bind(this));
        this.onChange();
      }

      cartUpdateUnsubscriber = undefined;
      variantChangeUnsubscriber = undefined;
      cartErrorUnsubscriber = undefined;

      onChange() {
        if (this.checkboxInput.checked) {
          this.enableInputFields();
          this.recipientFieldsLiveRegion.innerText = window.T4Sstrings.recipientFormExpanded;
        } else {
          this.clearInputFields();
          this.disableInputFields();
          this.recipientFieldsLiveRegion.innerText = window.T4Sstrings.recipientFormCollapsed;
        }
      }

      inputFields() {
        return [this.emailInput, this.nameInput, this.messageInput, this.sendonInput];
      }

      disableableFields() {
        return [...this.inputFields(), this.offsetProperty];
      }

      clearInputFields() {
        this.inputFields().forEach((field) => (field.value = ''));
      }

      enableInputFields() {
        this.disableableFields().forEach((field) => (field.disabled = false));
      }

      disableInputFields() {
        this.disableableFields().forEach((field) => (field.disabled = true));
      }

      /** ✅ FIXED: Displays an error message **/
      displayErrorMessage(title, body) {
        if (!this.errorMessageWrapper) {
          console.error("Error message wrapper not found!");
          return;
        }

        this.errorMessageWrapper.style.display = 'block'; // Make sure it's visible
        this.errorMessageWrapper.innerHTML = `
          <div style="color: red; padding: 10px; border: 1px solid red; background: #ffe6e6;">
            <strong>${title}</strong>: ${body}
          </div>
        `;
      }

      /** ✅ FIXED: Creates an error list item and appends it to target **/
      createErrorListItem(target, message) {
        if (!target) {
          console.error("Target element for error list not found!");
          return;
        }

        const errorItem = document.createElement('li');
        errorItem.style.color = 'red';
        errorItem.innerText = message;
        target.appendChild(errorItem);
      }

      resetRecipientForm() {
        if (this.checkboxInput.checked) {
          this.checkboxInput.checked = false;
          this.clearInputFields();
        }
      }
    }
  );
}
