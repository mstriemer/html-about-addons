"use strict";

const ADDON_CARD_HTML = "";
const CARD_CSS = `
:root {
  background: var(--in-content-box-background);
  border-radius: 4px;
  box-shadow: var(--card-shadow);
  margin: 0 0 8px;
  padding: 16px;
  transition: box-shadow 150ms;
}

:root {
  box-shadow: var(--card-shadow-hover);
}
`;

class Card extends HTMLElement {
  constructor() {
    super();
    this.connected = false;
    let shadow = this.attachShadow({mode: "open"});
    shadow.appendChild(document.importNode(Card.template.content, true));
  }

  connectedCallback() {
    if (this.connected) return;
    this.connected = true;
    this.shadowRoot.querySelector('[name="heading"]').textContent = this.getAttribute("heading");
    this.shadowRoot.querySelector('[name="subheading"]').textContent = this.getAttribute("subheading");
  }
}
Card.template = document.getElementById("CardTemplate");

customElements.define("moz-card", Card);

const AddonManager = {
  getAddonsByTypes() {
    return [{
      name: "uBlock Origin",
      description: "Finally, an efficient blocker. Easy on CPU and memory.",
    }, {
      name: "Group Speed Dial",
      description: `Speed Dial / visual bookmarks with groups for power users.
Now you can fit all your favorite sites into one fast SpeedDial in an organized fashion.

Dials are synchronized through Cloud to all your devices! For free!
No Ads!
www.FastAddons.com`,
    }, {
      name: "FastProxy - Россия",
      description: `Простой способ обхода блокировки для жителей РФ!
Через FastProxy будут запускаться только заблокированные сайты, что никак не повлияет на скорость загрузки других страниц.
FastProxy не логирует действия пользователей и не вставляет рекламу.`,
    }];
  },
};

async function initialize() {
  const addons = await AddonManager.getAddonsByTypes(["extension"]);

  let main = document.querySelector(".main");

  for (let addon of addons) {
    if (addon.isSystem) {
      continue;
    }

    let card = document.createElement("moz-card");
    card.setAttribute("heading", addon.name);
    card.setAttribute("subheading", addon.description || "");
    main.appendChild(card);
  }
}

initialize();
