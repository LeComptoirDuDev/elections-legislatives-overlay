export class PopUpInfo extends HTMLElement {
  static get observedAttributes() {
    return ["text", "img"];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const icon = document.createElement("span");
    icon.setAttribute("class", "icon");
    icon.setAttribute("tabindex", 0);

    this.info = document.createElement("span");
    this.info.setAttribute("class", "info");

    const text = this.getAttribute("text");
    this.info.textContent = text;

    let imgUrl;
    if (this.hasAttribute("img")) {
      imgUrl = this.getAttribute("img");
    } else {
      imgUrl = "img/default.png";
    }

    const img = document.createElement("img");
    img.src = imgUrl;
    icon.appendChild(img);

    const style = document.createElement("style");

    style.textContent = `
            .wrapper {
              position: relative;
            }
            .info {
              font-size: 0.8rem;
              width: 200px;
              display: inline-block;
              border: 1px solid black;
              padding: 10px;
              background: white;
              border-radius: 10px;
              opacity: 0;
              transition: 0.6s all;
              position: absolute;
              bottom: 20px;
              left: 10px;
              z-index: 3;
            }
            img {
              width: 1.2rem;
            }
            .icon:hover + .info, .icon:focus + .info {
              opacity: 1;
            }
          `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(icon);
    wrapper.appendChild(this.info);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(
      `Changement d'attribut détecté ${name} : ${oldValue} -> ${newValue}`
    );
    this.info.textContent = newValue;
  }
}
