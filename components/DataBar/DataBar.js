export class DataBar extends HTMLElement {
  static lisibleNumber(voices) {
    return voices.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ' ");
  }

  static get observedAttributes() {
    return ["label", "cast", "voices"];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "closed" });

    const wrapper = document.createElement("div");

    this.label = document.createElement("div");
    this.label.classList.add("label");

    this.bar = document.createElement("div");
    this.bar.classList.add("bar");

    this.cast = document.createElement("span");
    this.cast.classList.add("cast");

    this.voices = document.createElement("span");
    this.voices.classList.add("voices");

    const styleLink = document.createElement("link");
    styleLink.setAttribute("rel", "stylesheet");
    styleLink.setAttribute("href", "components/DataBar/DataBar.css");

    shadow.appendChild(styleLink);
    shadow.appendChild(wrapper);
    wrapper.replaceChildren(this.label, this.bar, this.cast, this.voices);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.label.textContent = this.getAttribute("label");
    this.bar.setAttribute("style", `width: ${this.getAttribute("cast")}%`);
    this.cast.textContent = `${this.getAttribute("cast")} %`;
    this.voices.textContent = `(${DataBar.lisibleNumber(
      this.getAttribute("voices")
    )} voix)`;
  }
}
