class CurrentTime extends HTMLElement {
    
    connectedCallback() {
        console.log("connected")

        this.html=
        `
        <div class="currentTime">
            <p class="currentTime__title"></p>
            <time class="currentTime__time"></time>
        </div>
        `;
        this.innerHTML= this.html;

        this.$title= this.querySelector(".currentTime__title");
        this.$time= this.querySelector(".currentTime__time");

        this.renderTitle();
        this.refresh = setInterval(() => {
            this.renderTime();
        }, 1000);
    }

    static get observedAttributes() {
        return ["format"];
    }

    attributeChangedCallback(format, oldVal, newVal) {
        this.format= newVal;
        if(this.$title){
            this.renderTitle();
        }
    }

    renderTitle() {
        this.$title.innerHTML = this.format === "utc" ? "Heure UTC" : "Heure locale";
        console.log("render title")
    }

    renderTime() {
        const date = new Date();
        this.$time.innerHTML = this.format === "utc" ? date.toUTCString() : date.toLocaleString();
        this.$time.setAttribute("datetime", date.toISOString());
        console.log("render time")
    }
        
    disconnectedCallback() {
        clearInterval(this.refresh);
        console.log("disconnected")
    }
};

class ScreenSize extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
        this.unit= "px"
        this.defaultFontsize= this.getFontsize();
        
        this.HTMLTemplate= 
        `
        <div>
            <p></p>
            <button></button>
        </div>
        `

        this.styleTemplate=
        `
        <style>
        div {
            margin: 10px;
            position: fixed;
            top: 0;
            right: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        p {
            width: fit-content;
            font-size: 2rem;
        }
        button {
            font-size: 1.2rem
        }
        </style>
        `


        this.shadowRoot.innerHTML= this.HTMLTemplate + this.styleTemplate;
        
        this.$displayWidth = this.shadowRoot.querySelector('p');
        this.$button = this.shadowRoot.querySelector('button');

        this.renderButton();
        this.renderWidth();

        this.$button.addEventListener('click', () => this.switchUnit());

        this.resizeListener = this.renderWidth.bind(this);
        window.addEventListener('resize', this.resizeListener);
    };

    // static get observedAttributes(){
    //     return['unit'];
    // }

    // attributeChangedCallback(unit, oldVal, newVal) {

    // }
    
    getFontsize() {
        return parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    switchUnit() {
        this.unit === "px" ? this.unit= "rem" : this.unit = "px";
        this.renderButton();
        this.renderWidth();
    }

    renderWidth() {
        this.screenWidth = window.innerWidth;
        this.$displayWidth.innerHTML = this.unit === "rem" ? `${this.screenWidth/this.defaultFontsize} ${this.unit}` : `${this.screenWidth} ${this.unit}`;
    } ;

    renderButton() {
        this.$button.innerHTML= this.unit === "px" ? "rem" : "px";
        console.log("rendered button")
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this.resizeListener)
        console.log("disconnected")
    }
}

class CustomDetails extends HTMLElement{

    constructor() {
        super();
        this.attachShadow({mode:"open"});
        const template = document.getElementById("custom-details").content;
        this.shadowRoot.appendChild(template.cloneNode(true));
        
        this.$details= this.shadowRoot.querySelector("details");

        this.$details.addEventListener("mouseover", () => this.openDetails());
        this.$details.addEventListener("focusin", () => this.openDetails());
        
        this.$details.addEventListener("mouseout", () => this.closeDetails());
        this.$details.addEventListener("focusout", () => this.closeDetails());

        window.addEventListener("keydown", (ev) => {
            if(ev.code === "Escape") {
                this.$details.removeAttribute('open');
            }
        });
    }

    openDetails() {
        this.$details.setAttribute('open', 'true');
    }

    closeDetails() {
        this.$details.removeAttribute('open');
    }

}

customElements.define("current-time", CurrentTime);
customElements.define("screen-size", ScreenSize);
customElements.define("custom-details", CustomDetails);