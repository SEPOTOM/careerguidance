(() => {
  "use strict";
  class e {
    constructor(e) {
      let t = {
        logging: !0,
        init: !0,
        attributeOpenButton: "data-popup",
        attributeCloseButton: "data-close",
        fixElementSelector: "[data-lp]",
        youtubeAttribute: "data-youtube",
        youtubePlaceAttribute: "data-youtube-place",
        setAutoplayYoutube: !0,
        classes: {
          popup: "popup",
          popupContent: "popup__content",
          popupActive: "popup_show",
          bodyActive: "popup-show",
        },
        focusCatch: !0,
        closeEsc: !0,
        bodyLock: !0,
        bodyLockDelay: 500,
        hashSettings: { location: !0, goHash: !0 },
        on: {
          beforeOpen: function () {},
          afterOpen: function () {},
          beforeClose: function () {},
          afterClose: function () {},
        },
      };
      (this.isOpen = !1),
        (this.targetOpen = { selector: !1, element: !1 }),
        (this.previousOpen = { selector: !1, element: !1 }),
        (this.lastClosed = { selector: !1, element: !1 }),
        (this._dataValue = !1),
        (this.hash = !1),
        (this._reopen = !1),
        (this._selectorOpen = !1),
        (this.lastFocusEl = !1),
        (this._focusEl = [
          "a[href]",
          'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
          "button:not([disabled]):not([aria-hidden])",
          "select:not([disabled]):not([aria-hidden])",
          "textarea:not([disabled]):not([aria-hidden])",
          "area[href]",
          "iframe",
          "object",
          "embed",
          "[contenteditable]",
          '[tabindex]:not([tabindex^="-"])',
        ]),
        (this.options = {
          ...t,
          ...e,
          classes: { ...t.classes, ...e?.classes },
          hashSettings: { ...t.hashSettings, ...e?.hashSettings },
          on: { ...t.on, ...e?.on },
        }),
        this.options.init && this.initPopups();
    }
    initPopups() {
      this.popupLogging("Проснулся"), this.eventsPopup();
    }
    eventsPopup() {
      document.addEventListener(
        "click",
        function (e) {
          const t = e.target.closest(`[${this.options.attributeOpenButton}]`);
          if (t)
            return (
              e.preventDefault(),
              (this._dataValue = t.getAttribute(
                this.options.attributeOpenButton
              )
                ? t.getAttribute(this.options.attributeOpenButton)
                : "error"),
              "error" !== this._dataValue
                ? (this.isOpen || (this.lastFocusEl = t),
                  (this.targetOpen.selector = `${this._dataValue}`),
                  (this._selectorOpen = !0),
                  void this.open())
                : void this.popupLogging(
                    `Ой ой, не заполнен атрибут у ${t.classList}`
                  )
            );
          return e.target.closest(`[${this.options.attributeCloseButton}]`) ||
            (!e.target.closest(`.${this.options.classes.popupContent}`) &&
              this.isOpen)
            ? (e.preventDefault(), void this.close())
            : void 0;
        }.bind(this)
      ),
        document.addEventListener(
          "keydown",
          function (e) {
            if (
              this.options.closeEsc &&
              27 == e.which &&
              "Escape" === e.code &&
              this.isOpen
            )
              return e.preventDefault(), void this.close();
            this.options.focusCatch &&
              9 == e.which &&
              this.isOpen &&
              this._focusCatch(e);
          }.bind(this)
        ),
        document.querySelector("form[data-ajax],form[data-dev]") &&
          document.addEventListener(
            "formSent",
            function (e) {
              const t = e.detail.form.dataset.popupMessage;
              t && this.open(t);
            }.bind(this)
          ),
        this.options.hashSettings.goHash &&
          (window.addEventListener(
            "hashchange",
            function () {
              window.location.hash
                ? this._openToHash()
                : this.close(this.targetOpen.selector);
            }.bind(this)
          ),
          window.addEventListener(
            "load",
            function () {
              window.location.hash && this._openToHash();
            }.bind(this)
          ));
    }
    open(e) {
      if (
        (e &&
          "string" == typeof e &&
          "" !== e.trim() &&
          ((this.targetOpen.selector = e), (this._selectorOpen = !0)),
        this.isOpen && ((this._reopen = !0), this.close()),
        this._selectorOpen ||
          (this.targetOpen.selector = this.lastClosed.selector),
        this._reopen || (this.previousActiveElement = document.activeElement),
        (this.targetOpen.element = document.querySelector(
          this.targetOpen.selector
        )),
        this.targetOpen.element)
      ) {
        if (
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute)
        ) {
          const e = `https://www.youtube.com/embed/${this.targetOpen.element.getAttribute(
              this.options.youtubeAttribute
            )}?rel=0&showinfo=0&autoplay=1`,
            t = document.createElement("iframe");
          t.setAttribute("allowfullscreen", "");
          const s = this.options.setAutoplayYoutube ? "autoplay;" : "";
          t.setAttribute("allow", `${s}; encrypted-media`),
            t.setAttribute("src", e),
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
              this.targetOpen.element
                .querySelector(`[${this.options.youtubePlaceAttribute}]`)
                .appendChild(t);
        }
        this.options.hashSettings.location &&
          (this._getHash(), this._setHash()),
          this.options.on.beforeOpen(this),
          this.targetOpen.element.classList.add(
            this.options.classes.popupActive
          ),
          document.body.classList.add(this.options.classes.bodyActive),
          this._reopen ? (this._reopen = !1) : u(),
          this.targetOpen.element.setAttribute("aria-hidden", "false"),
          (this.previousOpen.selector = this.targetOpen.selector),
          (this.previousOpen.element = this.targetOpen.element),
          (this._selectorOpen = !1),
          (this.isOpen = !0),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          document.dispatchEvent(
            new CustomEvent("afterPopupOpen", { detail: { popup: this } })
          ),
          this.popupLogging("Открыл попап");
      } else
        this.popupLogging(
          "Ой ой, такого попапа нет. Проверьте корректность ввода. "
        );
    }
    close(e) {
      e &&
        "string" == typeof e &&
        "" !== e.trim() &&
        (this.previousOpen.selector = e),
        this.isOpen &&
          a &&
          (this.options.on.beforeClose(this),
          this.targetOpen.element.hasAttribute(this.options.youtubeAttribute) &&
            this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ) &&
            (this.targetOpen.element.querySelector(
              `[${this.options.youtubePlaceAttribute}]`
            ).innerHTML = ""),
          this.previousOpen.element.classList.remove(
            this.options.classes.popupActive
          ),
          this.previousOpen.element.setAttribute("aria-hidden", "true"),
          this._reopen ||
            (document.body.classList.remove(this.options.classes.bodyActive),
            u(),
            (this.isOpen = !1)),
          this._removeHash(),
          this._selectorOpen &&
            ((this.lastClosed.selector = this.previousOpen.selector),
            (this.lastClosed.element = this.previousOpen.element)),
          this.options.on.afterClose(this),
          setTimeout(() => {
            this._focusTrap();
          }, 50),
          this.popupLogging("Закрыл попап"));
    }
    _getHash() {
      this.options.hashSettings.location &&
        (this.hash = this.targetOpen.selector.includes("#")
          ? this.targetOpen.selector
          : this.targetOpen.selector.replace(".", "#"));
    }
    _openToHash() {
      let e = document.querySelector(
        `.${window.location.hash.replace("#", "")}`
      )
        ? `.${window.location.hash.replace("#", "")}`
        : document.querySelector(`${window.location.hash}`)
        ? `${window.location.hash}`
        : null;
      document.querySelector(`[${this.options.attributeOpenButton}="${e}"]`) &&
        e &&
        this.open(e);
    }
    _setHash() {
      history.pushState("", "", this.hash);
    }
    _removeHash() {
      history.pushState("", "", window.location.href.split("#")[0]);
    }
    _focusCatch(e) {
      const t = this.targetOpen.element.querySelectorAll(this._focusEl),
        s = Array.prototype.slice.call(t),
        l = s.indexOf(document.activeElement);
      e.shiftKey && 0 === l && (s[s.length - 1].focus(), e.preventDefault()),
        e.shiftKey || l !== s.length - 1 || (s[0].focus(), e.preventDefault());
    }
    _focusTrap() {
      const e = this.previousOpen.element.querySelectorAll(this._focusEl);
      !this.isOpen && this.lastFocusEl
        ? this.lastFocusEl.focus()
        : e[0].focus();
    }
    popupLogging(e) {
      this.options.logging && n(`[Попапос]: ${e}`);
    }
  }
  let t = (e, t = 500, s = 0) => {
      e.classList.contains("_slide") ||
        (e.classList.add("_slide"),
        (e.style.transitionProperty = "height, margin, padding"),
        (e.style.transitionDuration = t + "ms"),
        (e.style.height = `${e.offsetHeight}px`),
        e.offsetHeight,
        (e.style.overflow = "hidden"),
        (e.style.height = s ? `${s}px` : "0px"),
        (e.style.paddingTop = 0),
        (e.style.paddingBottom = 0),
        (e.style.marginTop = 0),
        (e.style.marginBottom = 0),
        window.setTimeout(() => {
          (e.hidden = !s),
            !s && e.style.removeProperty("height"),
            e.style.removeProperty("padding-top"),
            e.style.removeProperty("padding-bottom"),
            e.style.removeProperty("margin-top"),
            e.style.removeProperty("margin-bottom"),
            !s && e.style.removeProperty("overflow"),
            e.style.removeProperty("transition-duration"),
            e.style.removeProperty("transition-property"),
            e.classList.remove("_slide");
        }, t));
    },
    s = (e, t = 500, s = 0) => {
      if (!e.classList.contains("_slide")) {
        e.classList.add("_slide"),
          (e.hidden = !e.hidden && null),
          s && e.style.removeProperty("height");
        let l = e.offsetHeight;
        (e.style.overflow = "hidden"),
          (e.style.height = s ? `${s}px` : "0px"),
          (e.style.paddingTop = 0),
          (e.style.paddingBottom = 0),
          (e.style.marginTop = 0),
          (e.style.marginBottom = 0),
          e.offsetHeight,
          (e.style.transitionProperty = "height, margin, padding"),
          (e.style.transitionDuration = t + "ms"),
          (e.style.height = l + "px"),
          e.style.removeProperty("padding-top"),
          e.style.removeProperty("padding-bottom"),
          e.style.removeProperty("margin-top"),
          e.style.removeProperty("margin-bottom"),
          window.setTimeout(() => {
            e.style.removeProperty("height"),
              e.style.removeProperty("overflow"),
              e.style.removeProperty("transition-duration"),
              e.style.removeProperty("transition-property"),
              e.classList.remove("_slide");
          }, t);
      }
    },
    l = (e, l = 500) => (e.hidden ? s(e, l) : t(e, l)),
    a = !0,
    u = (e = 500) => {
      document.documentElement.classList.contains("lock") ? c(e) : i(e);
    },
    c = (e = 500) => {
      let t = document.querySelector("body");
      if (a) {
        let s = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
          for (let e = 0; e < s.length; e++) {
            s[e].style.paddingRight = "0px";
          }
          (t.style.paddingRight = "0px"),
            document.documentElement.classList.remove("lock");
        }, e),
          (a = !1),
          setTimeout(function () {
            a = !0;
          }, e);
      }
    },
    i = (e = 500) => {
      let t = document.querySelector("body");
      if (a) {
        let s = document.querySelectorAll("[data-lp]");
        for (let e = 0; e < s.length; e++) {
          s[e].style.paddingRight =
            window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";
        }
        (t.style.paddingRight =
          window.innerWidth -
          document.querySelector(".wrapper").offsetWidth +
          "px"),
          document.documentElement.classList.add("lock"),
          (a = !1),
          setTimeout(function () {
            a = !0;
          }, e);
      }
    };
  function n(e) {
    setTimeout(() => {
      window.FLS && console.log(e);
    }, 0);
  }
  class o {
    constructor(e, t = null) {
      if (
        ((this.config = Object.assign({ init: !0, logging: !0 }, e)),
        (this.selectClasses = {
          classSelect: "select",
          classSelectBody: "select__body",
          classSelectTitle: "select__title",
          classSelectValue: "select__value",
          classSelectLabel: "select__label",
          classSelectInput: "select__input",
          classSelectText: "select__text",
          classSelectLink: "select__link",
          classSelectOptions: "select__options",
          classSelectOptionsScroll: "select__scroll",
          classSelectOption: "select__option",
          classSelectContent: "select__content",
          classSelectRow: "select__row",
          classSelectData: "select__asset",
          classSelectDisabled: "_select-disabled",
          classSelectTag: "_select-tag",
          classSelectOpen: "_select-open",
          classSelectActive: "_select-active",
          classSelectFocus: "_select-focus",
          classSelectMultiple: "_select-multiple",
          classSelectCheckBox: "_select-checkbox",
          classSelectOptionSelected: "_select-selected",
        }),
        (this._this = this),
        this.config.init)
      ) {
        const e = t
          ? document.querySelectorAll(t)
          : document.querySelectorAll("select");
        e.length
          ? (this.selectsInit(e),
            this.setLogging(`Проснулся, построил селектов: (${e.length})`))
          : this.setLogging("Сплю, нет ни одного select zzZZZzZZz");
      }
    }
    getSelectClass(e) {
      return `.${e}`;
    }
    getSelectElement(e, t) {
      return {
        originalSelect: e.querySelector("select"),
        selectElement: e.querySelector(this.getSelectClass(t)),
      };
    }
    selectsInit(e) {
      e.forEach((e, t) => {
        this.selectInit(e, t + 1);
      }),
        document.addEventListener(
          "click",
          function (e) {
            this.selectsActions(e);
          }.bind(this)
        ),
        document.addEventListener(
          "keydown",
          function (e) {
            this.selectsActions(e);
          }.bind(this)
        ),
        document.addEventListener(
          "focusin",
          function (e) {
            this.selectsActions(e);
          }.bind(this)
        ),
        document.addEventListener(
          "focusout",
          function (e) {
            this.selectsActions(e);
          }.bind(this)
        );
    }
    selectInit(e, t) {
      const s = this;
      let l = document.createElement("div");
      if (
        (l.classList.add(this.selectClasses.classSelect),
        e.parentNode.insertBefore(l, e),
        l.appendChild(e),
        (e.hidden = !0),
        t && (e.dataset.id = t),
        l.insertAdjacentHTML(
          "beforeend",
          `<div class="${this.selectClasses.classSelectBody}"><div hidden class="${this.selectClasses.classSelectOptions}"></div></div>`
        ),
        this.selectBuild(e),
        this.getSelectPlaceholder(e) &&
          ((e.dataset.placeholder = this.getSelectPlaceholder(e).value),
          this.getSelectPlaceholder(e).label.show))
      ) {
        this.getSelectElement(
          l,
          this.selectClasses.classSelectTitle
        ).selectElement.insertAdjacentHTML(
          "afterbegin",
          `<span class="${this.selectClasses.classSelectLabel}">${
            this.getSelectPlaceholder(e).label.text
              ? this.getSelectPlaceholder(e).label.text
              : this.getSelectPlaceholder(e).value
          }</span>`
        );
      }
      (e.dataset.speed = e.dataset.speed ? e.dataset.speed : "150"),
        e.addEventListener("change", function (e) {
          s.selectChange(e);
        });
    }
    selectBuild(e) {
      const t = e.parentElement;
      (t.dataset.id = e.dataset.id),
        t.classList.add(
          e.getAttribute("class") ? `select_${e.getAttribute("class")}` : ""
        ),
        e.multiple
          ? t.classList.add(this.selectClasses.classSelectMultiple)
          : t.classList.remove(this.selectClasses.classSelectMultiple),
        e.hasAttribute("data-checkbox") && e.multiple
          ? t.classList.add(this.selectClasses.classSelectCheckBox)
          : t.classList.remove(this.selectClasses.classSelectCheckBox),
        this.setSelectTitleValue(t, e),
        this.setOptions(t, e),
        e.hasAttribute("data-search") && this.searchActions(t),
        e.hasAttribute("data-open") && this.selectAction(t),
        this.selectDisabled(t, e);
    }
    selectsActions(e) {
      const t = e.target,
        s = e.type;
      if (
        t.closest(this.getSelectClass(this.selectClasses.classSelect)) ||
        t.closest(this.getSelectClass(this.selectClasses.classSelectTag))
      ) {
        const l = t.closest(".select")
            ? t.closest(".select")
            : document.querySelector(
                `.${this.selectClasses.classSelect}[data-id="${
                  t.closest(
                    this.getSelectClass(this.selectClasses.classSelectTag)
                  ).dataset.selectId
                }"]`
              ),
          a = this.getSelectElement(l).originalSelect;
        if ("click" === s) {
          if (!a.disabled)
            if (
              t.closest(this.getSelectClass(this.selectClasses.classSelectTag))
            ) {
              const e = t.closest(
                  this.getSelectClass(this.selectClasses.classSelectTag)
                ),
                s = document.querySelector(
                  `.${this.selectClasses.classSelect}[data-id="${e.dataset.selectId}"] .select__option[data-value="${e.dataset.value}"]`
                );
              this.optionAction(l, a, s);
            } else if (
              t.closest(
                this.getSelectClass(this.selectClasses.classSelectTitle)
              )
            )
              this.selectAction(l);
            else if (
              t.closest(
                this.getSelectClass(this.selectClasses.classSelectOption)
              )
            ) {
              const e = t.closest(
                this.getSelectClass(this.selectClasses.classSelectOption)
              );
              this.optionAction(l, a, e);
            }
        } else
          "focusin" === s || "focusout" === s
            ? t.closest(this.getSelectClass(this.selectClasses.classSelect)) &&
              ("focusin" === s
                ? l.classList.add(this.selectClasses.classSelectFocus)
                : l.classList.remove(this.selectClasses.classSelectFocus))
            : "keydown" === s && "Escape" === e.code && this.selectsСlose();
      } else this.selectsСlose();
    }
    selectsСlose() {
      const e = document.querySelectorAll(
        `${this.getSelectClass(
          this.selectClasses.classSelect
        )}${this.getSelectClass(this.selectClasses.classSelectOpen)}`
      );
      e.length &&
        e.forEach((e) => {
          this.selectAction(e);
        });
    }
    selectAction(e) {
      const t = this.getSelectElement(e).originalSelect,
        s = this.getSelectElement(
          e,
          this.selectClasses.classSelectOptions
        ).selectElement;
      s.classList.contains("_slide") ||
        (e.classList.toggle(this.selectClasses.classSelectOpen),
        l(s, t.dataset.speed));
    }
    setSelectTitleValue(e, t) {
      const s = this.getSelectElement(
          e,
          this.selectClasses.classSelectBody
        ).selectElement,
        l = this.getSelectElement(
          e,
          this.selectClasses.classSelectTitle
        ).selectElement;
      l && l.remove(),
        s.insertAdjacentHTML("afterbegin", this.getSelectTitleValue(e, t));
    }
    getSelectTitleValue(e, t) {
      let s = this.getSelectedOptionsData(t, 2).html;
      if (
        (t.multiple &&
          t.hasAttribute("data-tags") &&
          ((s = this.getSelectedOptionsData(t)
            .elements.map(
              (t) =>
                `<span role="button" data-select-id="${
                  e.dataset.id
                }" data-value="${
                  t.value
                }" class="_select-tag">${this.getSelectElementContent(
                  t
                )}</span>`
            )
            .join("")),
          t.dataset.tags &&
            document.querySelector(t.dataset.tags) &&
            ((document.querySelector(t.dataset.tags).innerHTML = s),
            t.hasAttribute("data-search") && (s = !1))),
        (s = s.length ? s : t.dataset.placeholder),
        this.getSelectedOptionsData(t).values.length
          ? e.classList.add(this.selectClasses.classSelectActive)
          : e.classList.remove(this.selectClasses.classSelectActive),
        t.hasAttribute("data-search"))
      )
        return `<div class="${this.selectClasses.classSelectTitle}"><span class="${this.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${s}" data-placeholder="${s}" class="${this.selectClasses.classSelectInput}"></span></div>`;
      {
        const e =
          this.getSelectedOptionsData(t).elements.length &&
          this.getSelectedOptionsData(t).elements[0].dataset.class
            ? ` ${this.getSelectedOptionsData(t).elements[0].dataset.class}`
            : "";
        return `<button type="button" class="${this.selectClasses.classSelectTitle}"><span class="${this.selectClasses.classSelectValue}"><span class="${this.selectClasses.classSelectContent}${e}">${s}</span></span></button>`;
      }
    }
    getSelectElementContent(e) {
      const t = e.dataset.asset ? `${e.dataset.asset}` : "",
        s = t.indexOf("img") >= 0 ? `<img src="${t}" alt="">` : t;
      let l = "";
      return (
        (l += t ? `<span class="${this.selectClasses.classSelectRow}">` : ""),
        (l += t ? `<span class="${this.selectClasses.classSelectData}">` : ""),
        (l += t ? s : ""),
        (l += t ? "</span>" : ""),
        (l += t ? `<span class="${this.selectClasses.classSelectText}">` : ""),
        (l += e.textContent),
        (l += t ? "</span>" : ""),
        (l += t ? "</span>" : ""),
        l
      );
    }
    getSelectPlaceholder(e) {
      const t = Array.from(e.options).find((e) => !e.value);
      if (t)
        return {
          value: t.textContent,
          show: t.hasAttribute("data-show"),
          label: { show: t.hasAttribute("data-label"), text: t.dataset.label },
        };
    }
    getSelectedOptionsData(e, t) {
      let s = [];
      return (
        e.multiple
          ? (s = Array.from(e.options)
              .filter((e) => e.value)
              .filter((e) => e.selected))
          : s.push(e.options[e.selectedIndex]),
        {
          elements: s.map((e) => e),
          values: s.filter((e) => e.value).map((e) => e.value),
          html: s.map((e) => this.getSelectElementContent(e)),
        }
      );
    }
    getOptions(e) {
      let t = e.hasAttribute("data-scroll") ? "data-simplebar" : "",
        s = e.dataset.scroll ? `style="max-height:${e.dataset.scroll}px"` : "",
        l = Array.from(e.options);
      if (l.length > 0) {
        let a = "";
        return (
          ((this.getSelectPlaceholder(e) &&
            !this.getSelectPlaceholder(e).show) ||
            e.multiple) &&
            (l = l.filter((e) => e.value)),
          (a += t
            ? `<div ${t} ${s} class="${this.selectClasses.classSelectOptionsScroll}">`
            : ""),
          l.forEach((t) => {
            a += this.getOption(t, e);
          }),
          (a += t ? "</div>" : ""),
          a
        );
      }
    }
    getOption(e, t) {
      const s =
          e.selected && t.multiple
            ? ` ${this.selectClasses.classSelectOptionSelected}`
            : "",
        l = e.selected && !t.hasAttribute("data-show-selected") ? "hidden" : "",
        a = e.dataset.class ? ` ${e.dataset.class}` : "",
        u = !!e.dataset.href && e.dataset.href,
        c = e.hasAttribute("data-href-blank") ? 'target="_blank"' : "";
      let i = "";
      return (
        (i += u
          ? `<a ${c} ${l} href="${u}" data-value="${e.value}" class="${this.selectClasses.classSelectOption}${a}${s}">`
          : `<button ${l} class="${this.selectClasses.classSelectOption}${a}${s}" data-value="${e.value}" type="button">`),
        (i += this.getSelectElementContent(e)),
        (i += u ? "</a>" : "</button>"),
        i
      );
    }
    setOptions(e, t) {
      this.getSelectElement(
        e,
        this.selectClasses.classSelectOptions
      ).selectElement.innerHTML = this.getOptions(t);
    }
    optionAction(e, t, s) {
      if (t.multiple) {
        s.classList.toggle(this.selectClasses.classSelectOptionSelected);
        this.getSelectedOptionsData(t).elements.forEach((e) => {
          e.removeAttribute("selected");
        });
        e.querySelectorAll(
          this.getSelectClass(this.selectClasses.classSelectOptionSelected)
        ).forEach((e) => {
          t.querySelector(`option[value="${e.dataset.value}"]`).setAttribute(
            "selected",
            "selected"
          );
        });
      } else
        t.hasAttribute("data-show-selected") ||
          (e.querySelector(
            `${this.getSelectClass(
              this.selectClasses.classSelectOption
            )}[hidden]`
          ) &&
            (e.querySelector(
              `${this.getSelectClass(
                this.selectClasses.classSelectOption
              )}[hidden]`
            ).hidden = !1),
          (s.hidden = !0)),
          (t.value = s.hasAttribute("data-value")
            ? s.dataset.value
            : s.textContent),
          this.selectAction(e);
      this.setSelectTitleValue(e, t), this.setSelectChange(t);
    }
    selectChange(e) {
      const t = e.target;
      this.selectBuild(t), this.setSelectChange(t);
    }
    setSelectChange(e) {
      if (
        (e.hasAttribute("data-validate") && v.validateInput(e),
        e.hasAttribute("data-submit") && e.value)
      ) {
        let t = document.createElement("button");
        (t.type = "submit"), e.closest("form").append(t), t.click(), t.remove();
      }
      const t = e.parentElement;
      this.selectCallback(t, e);
    }
    selectDisabled(e, t) {
      t.disabled
        ? (e.classList.add(this.selectClasses.classSelectDisabled),
          (this.getSelectElement(
            e,
            this.selectClasses.classSelectTitle
          ).selectElement.disabled = !0))
        : (e.classList.remove(this.selectClasses.classSelectDisabled),
          (this.getSelectElement(
            e,
            this.selectClasses.classSelectTitle
          ).selectElement.disabled = !1));
    }
    searchActions(e) {
      this.getSelectElement(e).originalSelect;
      const t = this.getSelectElement(
          e,
          this.selectClasses.classSelectInput
        ).selectElement,
        s = this.getSelectElement(
          e,
          this.selectClasses.classSelectOptions
        ).selectElement,
        l = s.querySelectorAll(`.${this.selectClasses.classSelectOption}`),
        a = this;
      t.addEventListener("input", function () {
        l.forEach((e) => {
          e.textContent.toUpperCase().indexOf(t.value.toUpperCase()) >= 0
            ? (e.hidden = !1)
            : (e.hidden = !0);
        }),
          !0 === s.hidden && a.selectAction(e);
      });
    }
    selectCallback(e, t) {
      document.dispatchEvent(
        new CustomEvent("selectCallback", { detail: { select: t } })
      );
    }
    setLogging(e) {
      this.config.logging && n(`[select]: ${e}`);
    }
  }
  const r = { inputMaskModule: null, selectModule: null };
  let v = {
    getErrors(e) {
      let t = 0,
        s = e.querySelectorAll("*[data-required]");
      return (
        s.length &&
          s.forEach((e) => {
            (null === e.offsetParent && "SELECT" !== e.tagName) ||
              e.disabled ||
              (t += this.validateInput(e));
          }),
        t
      );
    },
    validateInput(e) {
      let t = 0;
      return (
        "email" === e.dataset.required
          ? ((e.value = e.value.replace(" ", "")),
            this.emailTest(e) ? (this.addError(e), t++) : this.removeError(e))
          : ("checkbox" !== e.type || e.checked) && e.value
          ? this.removeError(e)
          : (this.addError(e), t++),
        t
      );
    },
    addError(e) {
      e.classList.add("_form-error"),
        e.parentElement.classList.add("_form-error");
      let t = e.parentElement.querySelector(".form__error");
      t && e.parentElement.removeChild(t),
        e.dataset.error &&
          e.parentElement.insertAdjacentHTML(
            "beforeend",
            `<div class="form__error">${e.dataset.error}</div>`
          );
    },
    removeError(e) {
      e.classList.remove("_form-error"),
        e.parentElement.classList.remove("_form-error"),
        e.parentElement.querySelector(".form__error") &&
          e.parentElement.removeChild(
            e.parentElement.querySelector(".form__error")
          );
    },
    formClean(e) {
      e.reset(),
        setTimeout(() => {
          let t = e.querySelectorAll("input,textarea");
          for (let e = 0; e < t.length; e++) {
            const s = t[e];
            s.parentElement.classList.remove("_form-focus"),
              s.classList.remove("_form-focus"),
              v.removeError(s),
              (s.value = s.dataset.placeholder);
          }
          let s = e.querySelectorAll(".checkbox__input");
          if (s.length > 0)
            for (let e = 0; e < s.length; e++) {
              s[e].checked = !1;
            }
          if (r.selectModule) {
            let t = e.querySelectorAll(".select");
            if (t.length)
              for (let e = 0; e < t.length; e++) {
                const s = t[e].querySelector("select");
                r.selectModule.selectBuild(s);
              }
          }
        }, 0);
    },
    emailTest: (e) =>
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(e.value),
  };
  let h = !1;
  function d() {
    const e = document.querySelectorAll(".table__line");
    let t, s, l, a, u;
    function c(e) {
      return e < 1 ? "-1" : e > 6 ? "+1" : "0";
    }
    function i(e) {
      return e < 2 ? "-1" : e > 5 ? "+1" : "0";
    }
    function n(e) {
      return e < 2 ? "-1" : e > 6 ? "+1" : "0";
    }
    function o(e) {
      return e < 3 ? "-1" : e > 6 ? "+1" : "0";
    }
    function r(e) {
      return e < 3 ? "-1" : e > 7 ? "+1" : "0";
    }
    function v(e) {
      return e < 4 ? "-1" : e > 7 ? "+1" : "0";
    }
    function h(e) {
      return e < 4 ? "-1" : e > 8 ? "+1" : "0";
    }
    function d(e) {
      return e < 5 ? "-1" : e > 7 ? "+1" : "0";
    }
    function p(e) {
      return e < 5 ? "-1" : e > 8 ? "+1" : "0";
    }
    function m(e) {
      return e < 5 ? "-1" : e > 9 ? "+1" : "0";
    }
    function g(e) {
      return e < 6 ? "-1" : e > 8 ? "+1" : "0";
    }
    function b(e) {
      return e < 6 ? "-1" : e > 9 ? "+1" : "0";
    }
    e.length &&
      e.forEach((S) => {
        !(function (e) {
          (t = e.querySelector(".table__input")),
            (s = t.value),
            (a = e.querySelector("[data-norm]")),
            (u = (function () {
              let e;
              return (
                document.querySelectorAll(".select__option").forEach((t) => {
                  t.hidden && (e = t.dataset.value);
                }),
                e
              );
            })());
        })(S),
          (function (t) {
            if (1 == u)
              switch (t) {
                case e[0]:
                  l = h(s);
                  break;
                case e[1]:
                  l = r(s);
                  break;
                case e[2]:
                  l = v(s);
                  break;
                case e[3]:
                  l = p(s);
                  break;
                case e[4]:
                  l = m(s);
                  break;
                case e[5]:
                  l = n(s);
                  break;
                case e[6]:
                  l = v(s);
                  break;
                case e[7]:
                  l = (a = s) < 2 ? "-1" : a > 8 ? "+1" : "0";
                  break;
                case e[8]:
                  l = b(s);
                  break;
                case e[9]:
                  l = h(s);
                  break;
                case e[10]:
                  l = b(s);
                  break;
                case e[11]:
                  l = r(s);
                  break;
                case e[12]:
                  l = h(s);
                  break;
                case e[13]:
                  l = d(s);
                  break;
                case e[14]:
                  l = o(s);
                  break;
                case e[15]:
                  l = h(s);
                  break;
                case e[16]:
                  l = (function (e) {
                    return e < 1 ? "-1" : e > 5 ? "+1" : "0";
                  })(s);
                  break;
                case e[17]:
                case e[18]:
                  l = n(s);
                  break;
                case e[19]:
                  l = h(s);
                  break;
                case e[20]:
                  l = o(s);
                  break;
                case e[21]:
                  l = n(s);
                  break;
                case e[22]:
                  l = d(s);
                  break;
                case e[23]:
                  l = n(s);
                  break;
                case e[24]:
                  l = o(s);
                  break;
                case e[25]:
                  l = r(s);
                  break;
                case e[26]:
                case e[27]:
                  l = h(s);
                  break;
                case e[28]:
                case e[29]:
                  l = g(s);
                  break;
                case e[30]:
                case e[31]:
                  l = h(s);
                  break;
                case e[32]:
                  l = v(s);
                  break;
                case e[33]:
                  l = p(s);
              }
            else if (2 == u)
              switch (t) {
                case e[0]:
                  l = h(s);
                  break;
                case e[1]:
                  l = r(s);
                  break;
                case e[2]:
                  l = n(s);
                  break;
                case e[3]:
                  l = (function (e) {
                    return e < 2 ? "-1" : e > 7 ? "+1" : "0";
                  })(s);
                  break;
                case e[4]:
                  l = b(s);
                  break;
                case e[5]:
                  l = p(s);
                  break;
                case e[6]:
                  l = b(s);
                  break;
                case e[7]:
                  l = (function (e) {
                    return e < 3 ? "-1" : e > 8 ? "+1" : "0";
                  })(s);
                  break;
                case e[8]:
                  l = p(s);
                  break;
                case e[9]:
                  l = r(s);
                  break;
                case e[10]:
                  l = p(s);
                  break;
                case e[11]:
                  l = o(s);
                  break;
                case e[12]:
                  l = m(s);
                  break;
                case e[13]:
                  l = p(s);
                  break;
                case e[14]:
                  l = h(s);
                  break;
                case e[15]:
                  l = b(s);
                  break;
                case e[16]:
                case e[17]:
                  l = c(s);
                  break;
                case e[18]:
                  l = i(s);
                  break;
                case e[19]:
                  l = r(s);
                  break;
                case e[20]:
                  l = v(s);
                  break;
                case e[21]:
                case e[22]:
                  l = b(s);
                  break;
                case e[23]:
                  l = o(s);
                  break;
                case e[24]:
                  l = r(s);
                  break;
                case e[25]:
                  l = i(s);
                  break;
                case e[26]:
                  l = v(s);
                  break;
                case e[27]:
                case e[28]:
                  l = b(s);
                  break;
                case e[29]:
                  l = p(s);
                  break;
                case e[30]:
                  l = b(s);
                  break;
                case e[31]:
                  l = p(s);
                  break;
                case e[32]:
                  l = b(s);
                  break;
                case e[33]:
                  l = h(s);
              }
            var a;
          })(S),
          (a.innerHTML = l);
      });
  }
  function p() {
    document.querySelector("[data-summ]").innerHTML = (function () {
      const e = document.querySelectorAll("[data-norm]"),
        t = Array.from(e).map(function (e, t, s) {
          return +e.textContent;
        });
      return t.reduce(function (e, t) {
        return e + t;
      });
    })();
  }
  function m() {
    const e = document.querySelectorAll(".popup__prc"),
      t = document.querySelectorAll(".table__input");
    let s;
    !(function () {
      const e = document.querySelector("[data-summ]").innerHTML;
      s = e < -5 ? 1.3 : e > 6 ? 0.7 : 0;
    })(),
      e.length &&
        e.forEach((l) => {
          let a = (function (l, a) {
            return (
              (a = (function (s) {
                switch (s) {
                  case e[0]:
                    return (
                      2 * t[6].value +
                      +t[8].value +
                      3 * t[9].value +
                      2 * t[14].value +
                      2 * t[16].value
                    );
                  case e[1]:
                    return (
                      2 * t[1].value +
                      2 * t[4].value +
                      2 * t[10].value +
                      2 * t[19].value +
                      +t[20].value +
                      +t[25].value
                    );
                  case e[2]:
                    return (
                      +t[1].value +
                      2 * t[5].value +
                      +t[12].value +
                      +t[16].value +
                      +t[18].value +
                      +t[25].value +
                      2 * t[29].value +
                      +t[32].value
                    );
                  case e[3]:
                    return (
                      2 * t[1].value +
                      2 * t[4].value +
                      +t[9].value +
                      +t[10].value +
                      +t[12].value +
                      +t[17].value +
                      +t[19].value +
                      +t[21].value
                    );
                  case e[4]:
                    return (
                      2 * t[1].value +
                      2 * t[4].value +
                      2 * t[6].value +
                      3 * t[17].value +
                      +t[21].value
                    );
                  case e[5]:
                    return (
                      +t[5].value +
                      +t[6].value +
                      2 * t[15].value +
                      3 * t[16].value +
                      2 * t[18].value +
                      +t[19].value
                    );
                  case e[6]:
                    return (
                      2 * t[8].value +
                      2 * t[13].value +
                      2 * t[15].value +
                      +t[18].value +
                      +t[19].value +
                      +t[22].value +
                      +t[25].value
                    );
                  case e[7]:
                    return (
                      +t[8].value +
                      +t[9].value +
                      +t[11].value +
                      +t[12].value +
                      +t[13].value +
                      +t[15].value +
                      2 * t[17].value +
                      +t[21].value
                    );
                  case e[8]:
                    return (
                      3 * t[5].value +
                      2 * t[13].value +
                      3 * t[20].value +
                      +t[23].value +
                      +t[31].value
                    );
                  case e[9]:
                    return (
                      +t[4].value +
                      2 * t[5].value +
                      +t[6].value +
                      +t[11].value +
                      2 * t[14].value +
                      +t[16].value +
                      +t[18].value +
                      +t[25].value
                    );
                  case e[10]:
                    return (
                      +t[5].value +
                      2 * t[9].value +
                      +t[13].value +
                      +t[14].value +
                      +t[15].value +
                      +t[18].value +
                      +t[19].value +
                      +t[25].value +
                      +t[26].value
                    );
                  case e[11]:
                    return (
                      +t[4].value +
                      +t[9].value +
                      2 * t[10].value +
                      +t[12].value +
                      +t[15].value +
                      +t[16].value +
                      2 * t[1].value +
                      +t[27].value
                    );
                  case e[12]:
                    return (
                      3 * t[2].value +
                      4 * t[3].value +
                      +t[17].value +
                      +t[31].value +
                      +t[32].value
                    );
                  case e[13]:
                    return (
                      +t[6].value +
                      2 * t[16].value +
                      +t[18].value +
                      +t[20].value +
                      +t[22].value +
                      +t[25].value +
                      +t[29].value +
                      +t[32].value +
                      +t[33].value
                    );
                  case e[14]:
                    return (
                      +t[9].value +
                      +t[15].value +
                      4 * t[16].value +
                      +t[19].value +
                      2 * t[25].value +
                      +t[33].value
                    );
                  case e[15]:
                    return (
                      +t[0].value +
                      3 * t[2].value +
                      +t[8].value +
                      +t[14].value +
                      +t[17].value +
                      3 * t[27].value
                    );
                  case e[16]:
                    return (
                      +t[5].value +
                      2 * t[10].value +
                      2 * t[13].value +
                      +t[14].value +
                      2 * t[15].value +
                      +t[18].value +
                      +t[25].value
                    );
                  case e[17]:
                    return (
                      4 * t[2].value +
                      +t[6].value +
                      3 * t[18].value +
                      +t[22].value +
                      +t[23].value
                    );
                  case e[18]:
                    return (
                      2 * t[9].value +
                      +t[11].value +
                      +t[14].value +
                      2 * t[15].value +
                      +t[18].value +
                      +t[22].value +
                      2 * t[24].value
                    );
                  case e[19]:
                    return (
                      2 * t[2].value +
                      2 * t[6].value +
                      +t[12].value +
                      +t[15].value +
                      +t[18].value +
                      +t[20].value +
                      2 * t[26].value
                    );
                  case e[20]:
                    return (
                      2 * t[2].value +
                      2 * t[3].value +
                      +t[8].value +
                      +t[9].value +
                      +t[12].value +
                      +t[14].value +
                      2 * t[31].value
                    );
                  case e[21]:
                    return (
                      +t[2].value +
                      +t[6].value +
                      +t[11].value +
                      +t[12].value +
                      +t[13].value +
                      3 * t[15].value +
                      2 * t[18].value
                    );
                  case e[22]:
                    return (
                      3 * t[9].value +
                      3 * t[10].value +
                      +t[15].value +
                      +t[16].value +
                      2 * t[19].value
                    );
                  case e[23]:
                    return (
                      +t[0].value +
                      2 * t[8].value +
                      2 * t[12].value +
                      +t[15].value +
                      +t[17].value +
                      2 * t[19].value +
                      +t[27].value
                    );
                  case e[24]:
                    return (
                      2 * t[5].value +
                      2 * t[12].value +
                      +t[18].value +
                      +t[25].value +
                      3 * t[29].value +
                      +t[32].value
                    );
                  case e[25]:
                    return (
                      +t[6].value +
                      5 * t[9].value +
                      3 * t[14].value +
                      +t[17].value
                    );
                  case e[26]:
                    return (
                      +t[7].value +
                      2 * t[9].value +
                      +t[10].value +
                      2 * t[12].value +
                      +t[15].value +
                      +t[16].value +
                      +t[19].value +
                      +t[17].value
                    );
                  case e[27]:
                    return (
                      +t[0].value +
                      3 * t[8].value +
                      2 * t[9].value +
                      +t[12].value +
                      2 * t[16].value +
                      +t[17].value
                    );
                  case e[28]:
                    return (
                      +t[8].value +
                      +t[9].value +
                      2 * t[15].value +
                      2 * t[16].value +
                      3 * t[19].value +
                      +t[27].value
                    );
                  case e[29]:
                    return (
                      +t[7].value +
                      +t[10].value +
                      +t[16].value +
                      +t[17].value +
                      2 * t[28].value +
                      +t[29].value +
                      3 * t[30].value
                    );
                  case e[30]:
                    return (
                      +t[5].value +
                      +t[7].value +
                      +t[8].value +
                      +t[10].value +
                      +t[15].value +
                      +t[19].value +
                      +t[25].value +
                      +t[26].value +
                      +t[29].value
                    );
                  case e[31]:
                    return (
                      2 * t[2].value +
                      3 * t[6].value +
                      +t[11].value +
                      +t[16].value +
                      +t[18].value +
                      +t[21].value +
                      +t[23].value
                    );
                  case e[32]:
                    return (
                      2 * t[6].value +
                      +t[9].value +
                      +t[16].value +
                      +t[18].value +
                      2 * t[19].value +
                      +t[31].value +
                      2 * t[32].value
                    );
                  case e[33]:
                    return (
                      +t[1].value +
                      2 * t[4].value +
                      +t[11].value +
                      +t[14].value +
                      2 * t[17].value +
                      3 * t[21].value
                    );
                  case e[34]:
                    return (
                      +t[1].value +
                      +t[4].value +
                      +t[15].value +
                      +t[12].value +
                      +t[18].value +
                      +t[23].value +
                      +t[25].value +
                      +t[28].value +
                      +t[30].value +
                      +t[32].value
                    );
                  case e[35]:
                    return (
                      +t[6].value +
                      3 * t[9].value +
                      +t[14].value +
                      3 * t[16].value +
                      +t[19].value +
                      +t[33].value
                    );
                  case e[36]:
                    return (
                      2 * t[7].value +
                      +t[8].value +
                      +t[10].value +
                      2 * t[15].value +
                      +t[19].value +
                      +t[25].value +
                      +t[26].value +
                      +t[29].value
                    );
                  case e[37]:
                    return (
                      +t[7].value +
                      +t[8].value +
                      +t[13].value +
                      2 * t[15].value +
                      +t[16].value +
                      +t[19].value +
                      +t[26].value +
                      2 * t[29].value
                    );
                  case e[38]:
                    return (
                      +t[5].value +
                      2 * t[12].value +
                      +t[15].value +
                      2 * t[18].value +
                      +t[21].value +
                      +t[22].value +
                      +t[23].value +
                      +t[26].value
                    );
                  case e[39]:
                    return (
                      +t[3].value +
                      3 * t[6].value +
                      4 * t[9].value +
                      +t[14].value +
                      +t[32].value
                    );
                  case e[40]:
                    return (
                      2 * t[2].value +
                      2 * t[6].value +
                      5 * t[14].value +
                      +t[18].value
                    );
                  case e[41]:
                    return (
                      2 * t[0].value +
                      4 * t[3].value +
                      2 * t[17].value +
                      +t[27].value +
                      +t[31].value
                    );
                  case e[42]:
                    return (
                      +t[2].value +
                      2 * t[6].value +
                      +t[10].value +
                      +t[14].value +
                      +t[16].value +
                      2 * t[18].value +
                      +t[19].value +
                      +t[23].value
                    );
                  case e[43]:
                    return (
                      +t[5].value +
                      3 * t[6].value +
                      +t[9].value +
                      2 * t[12].value +
                      +t[16].value +
                      +t[18].value +
                      +t[19].value
                    );
                  case e[44]:
                    return (
                      2 * t[6].value +
                      +t[15].value +
                      +t[16].value +
                      2 * t[18].value +
                      +t[19].value +
                      +t[21].value +
                      +t[24].value +
                      +t[29].value
                    );
                  case e[45]:
                    return (
                      3 * t[5].value +
                      +t[6].value +
                      +t[14].value +
                      +t[18].value +
                      +t[20].value +
                      +t[23].value +
                      2 * t[31].value
                    );
                  case e[46]:
                    return (
                      3 * t[1].value +
                      +t[4].value +
                      +t[14].value +
                      2 * t[17].value +
                      +t[21].value +
                      +t[23].value +
                      +t[32].value
                    );
                  case e[47]:
                    return (
                      +t[5].value +
                      +t[12].value +
                      +t[14].value +
                      2 * t[18].value +
                      3 * t[20].value +
                      +t[22].value +
                      +t[25].value
                    );
                  case e[48]:
                    return (
                      +t[2].value +
                      +t[7].value +
                      2 * t[13].value +
                      2 * t[15].value +
                      +t[18].value +
                      2 * t[24].value +
                      +t[29].value
                    );
                  case e[49]:
                    return (
                      +t[1].value +
                      +t[5].value +
                      +t[6].value +
                      +t[18].value +
                      +t[23].value +
                      +t[25].value +
                      +t[28].value +
                      +t[29].value +
                      2 * t[30].value
                    );
                  case e[50]:
                    return (
                      +t[1].value +
                      +t[2].value +
                      2 * t[4].value +
                      +t[6].value +
                      2 * t[11].value +
                      +t[18].value +
                      +t[21].value +
                      +t[25].value
                    );
                  case e[51]:
                    return (
                      2 * t[8].value +
                      +t[9].value +
                      2 * t[10].value +
                      +t[16].value +
                      2 * t[19].value +
                      +t[25].value +
                      +t[33].value
                    );
                  case e[52]:
                    return (
                      +t[8].value +
                      3 * t[9].value +
                      +t[14].value +
                      2 * t[15].value +
                      2 * t[16].value +
                      +t[19].value
                    );
                  case e[53]:
                    return (
                      2 * t[12].value +
                      +t[13].value +
                      +t[15].value +
                      +t[18].value +
                      3 * t[19].value +
                      +t[25].value +
                      +t[27].value
                    );
                  case e[54]:
                    return (
                      +t[2].value +
                      5 * t[8].value +
                      +t[9].value +
                      2 * t[14].value +
                      +t[33].value
                    );
                  case e[55]:
                    return (
                      2 * t[9].value +
                      +t[10].value +
                      +t[15].value +
                      2 * t[16].value +
                      3 * t[19].value +
                      +t[25].value
                    );
                  case e[56]:
                    return (
                      +t[5].value +
                      2 * t[6].value +
                      2 * t[12].value +
                      +t[13].value +
                      +t[18].value +
                      2 * t[19].value +
                      +t[21].value
                    );
                  case e[57]:
                    return (
                      2 * t[6].value +
                      +t[8].value +
                      +t[11].value +
                      2 * t[13].value +
                      +t[15].value +
                      +t[18].value +
                      +t[22].value +
                      +t[25].value
                    );
                  case e[58]:
                    return (
                      +t[6].value +
                      +t[7].value +
                      3 * t[13].value +
                      2 * t[15].value +
                      +t[18].value +
                      +t[24].value +
                      +t[29].value
                    );
                  case e[59]:
                    return (
                      2 * t[6].value +
                      +t[7].value +
                      +t[11].value +
                      2 * t[15].value +
                      +t[16].value +
                      +t[18].value +
                      2 * t[24].value
                    );
                  case e[60]:
                    return (
                      +t[5].value +
                      2 * t[11].value +
                      +t[14].value +
                      2 * t[15].value +
                      2 * t[18].value +
                      +t[22].value +
                      +t[25].value
                    );
                  case e[61]:
                    return (
                      2 * t[1].value +
                      2 * t[4].value +
                      +t[21].value +
                      +t[25].value +
                      +t[28].value +
                      +t[30].value +
                      2 * t[31].value
                    );
                  case e[62]:
                    return (
                      2 * t[1].value +
                      +t[2].value +
                      +t[4].value +
                      +t[10].value +
                      +t[14].value +
                      +t[23].value +
                      +t[28].value +
                      +t[31].value
                    );
                  case e[63]:
                    return (
                      +t[1].value +
                      2 * t[4].value +
                      3 * t[5].value +
                      +t[14].value +
                      +t[18].value +
                      +t[20].value +
                      +t[22].value
                    );
                  case e[64]:
                    return (
                      +t[10].value +
                      +t[11].value +
                      2 * t[13].value +
                      2 * t[15].value +
                      +t[19].value +
                      +t[21].value +
                      +t[23].value +
                      +t[25].value
                    );
                  case e[65]:
                    return (
                      +t[1].value +
                      +t[3].value +
                      +t[6].value +
                      +t[16].value +
                      +t[23].value +
                      +t[25].value +
                      +t[28].value +
                      +t[30].value +
                      2 * t[32].value
                    );
                  case e[66]:
                    return (
                      2 * t[1].value +
                      3 * t[4].value +
                      +t[6].value +
                      +t[12].value +
                      +t[14].value +
                      +t[17].value +
                      +t[20].value
                    );
                  case e[67]:
                    return (
                      +t[8].value +
                      +t[9].value +
                      3 * t[15].value +
                      2 * t[16].value +
                      2 * t[19].value +
                      +t[33].value
                    );
                  case e[68]:
                    return (
                      3 * t[2].value +
                      +t[11].value +
                      3 * t[17].value +
                      2 * t[27].value +
                      +t[33].value
                    );
                  case e[69]:
                    return (
                      +t[1].value +
                      2 * t[5].value +
                      +t[6].value +
                      +t[12].value +
                      +t[18].value +
                      2 * t[21].value +
                      +t[25].value +
                      +t[32].value
                    );
                  case e[70]:
                    return (
                      +t[6].value +
                      3 * t[9].value +
                      2 * t[14].value +
                      2 * t[17].value +
                      2 * t[32].value
                    );
                  case e[71]:
                    return (
                      +t[1].value +
                      +t[5].value +
                      2 * t[6].value +
                      +t[11].value +
                      +t[12].value +
                      +t[15].value +
                      +t[18].value +
                      2 * t[23].value
                    );
                }
              })(l)),
              s ? ((a *= s), (a = Math.round(10 * a) / 10) + "%") : a + "%"
            );
          })(l);
          l.innerHTML = a;
        });
  }
  setTimeout(() => {
    if (h) {
      let e = new Event("windowScroll");
      window.addEventListener("scroll", function (t) {
        document.dispatchEvent(e);
      });
    }
  }, 0);
  document
    .querySelector(".btn__button")
    .addEventListener("click", function (e) {
      d(), p(), m();
    }),
    (window.FLS = !0),
    (function (e) {
      let t = new Image();
      (t.onload = t.onerror =
        function () {
          e(2 == t.height);
        }),
        (t.src =
          "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA");
    })(function (e) {
      let t = !0 === e ? "webp" : "no-webp";
      document.documentElement.classList.add(t);
    }),
    new e({}),
    (r.selectModule = new o({}));
})();
