export class Legend extends HTMLElement {
  static get observedAttributes() {
    return ["label", "color", "delegates"];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "closed" });

    const wrapper = document.createElement("div");
    wrapper.classList.add("tag");

    this.color = document.createElement("div");
    this.color.classList.add("color");

    this.label = document.createElement("div");
    this.label.classList.add("label");

    this.delegates = document.createElement("div");
    this.delegates.classList.add("delegates");

    const styleLink = document.createElement("link");
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("href", `../components/Legend/Legend.css`);

    shadow.appendChild(styleLink);
    shadow.appendChild(wrapper);
    wrapper.replaceChildren(this.color, this.label, this.delegates);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.label.textContent = this.getAttribute("label");
    this.color.setAttribute(
      "style",
      `background: ${this.getAttribute("color")}`
    );
    this.delegates.textContent = `${this.getAttribute("delegates")}`;
  }
}
