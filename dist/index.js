import { Command, Plugin, toWidget, uid, global, WidgetToolbarRepository, ButtonView } from "ckeditor5";
import mermaid from "mermaid";
import { debounce } from "es-toolkit/compat";
function checkIsOn(editor, commandName) {
  const selection = editor.model.document.selection;
  const mermaidItem = selection.getSelectedElement() || selection.getLastPosition().parent;
  if (mermaidItem && mermaidItem.is("element", "mermaid") && mermaidItem.getAttribute("displayMode") === commandName) {
    return true;
  }
  return false;
}
class MermaidPreviewCommand extends Command {
  /**
   * @inheritDoc
   */
  refresh() {
    const editor = this.editor;
    const documentSelection = editor.model.document.selection;
    const selectedElement = documentSelection.getSelectedElement();
    const isSelectedElementMermaid = selectedElement && selectedElement.name === "mermaid";
    if (isSelectedElementMermaid || documentSelection.getLastPosition().findAncestor("mermaid")) {
      this.isEnabled = !!selectedElement;
    } else {
      this.isEnabled = false;
    }
    this.value = checkIsOn(editor, "preview");
  }
  /**
   * @inheritDoc
   */
  execute() {
    const editor = this.editor;
    const model = editor.model;
    const documentSelection = this.editor.model.document.selection;
    const mermaidItem = documentSelection.getSelectedElement() || documentSelection.getLastPosition().parent;
    model.change((writer) => {
      if (mermaidItem.getAttribute("displayMode") !== "preview") {
        writer.setAttribute("displayMode", "preview", mermaidItem);
      }
    });
  }
}
class MermaidSourceViewCommand extends Command {
  /**
   * @inheritDoc
   */
  refresh() {
    const editor = this.editor;
    const documentSelection = editor.model.document.selection;
    const selectedElement = documentSelection.getSelectedElement();
    const isSelectedElementMermaid = selectedElement && selectedElement.name === "mermaid";
    if (isSelectedElementMermaid || documentSelection.getLastPosition().findAncestor("mermaid")) {
      this.isEnabled = !!selectedElement;
    } else {
      this.isEnabled = false;
    }
    this.value = checkIsOn(editor, "source");
  }
  /**
   * @inheritDoc
   */
  execute() {
    const editor = this.editor;
    const model = editor.model;
    const documentSelection = this.editor.model.document.selection;
    const mermaidItem = documentSelection.getSelectedElement() || documentSelection.getLastPosition().parent;
    model.change((writer) => {
      if (mermaidItem.getAttribute("displayMode") !== "source") {
        writer.setAttribute("displayMode", "source", mermaidItem);
      }
    });
  }
}
class MermaidSplitViewCommand extends Command {
  /**
   * @inheritDoc
   */
  refresh() {
    const editor = this.editor;
    const documentSelection = editor.model.document.selection;
    const selectedElement = documentSelection.getSelectedElement();
    const isSelectedElementMermaid = selectedElement && selectedElement.name === "mermaid";
    if (isSelectedElementMermaid || documentSelection.getLastPosition().findAncestor("mermaid")) {
      this.isEnabled = !!selectedElement;
    } else {
      this.isEnabled = false;
    }
    this.value = checkIsOn(editor, "split");
  }
  /**
   * @inheritDoc
   */
  execute() {
    const editor = this.editor;
    const model = editor.model;
    const documentSelection = this.editor.model.document.selection;
    const mermaidItem = documentSelection.getSelectedElement() || documentSelection.getLastPosition().parent;
    model.change((writer) => {
      if (mermaidItem.getAttribute("displayMode") !== "split") {
        writer.setAttribute("displayMode", "split", mermaidItem);
      }
    });
  }
}
const MOCK_MERMAID_MARKUP = `flowchart TB
A --> B
B --> C`;
class InsertMermaidCommand extends Command {
  /**
   * @inheritDoc
   */
  refresh() {
    const documentSelection = this.editor.model.document.selection;
    const selectedElement = documentSelection.getSelectedElement();
    if (selectedElement && selectedElement.name === "mermaid") {
      this.isEnabled = false;
    } else {
      this.isEnabled = true;
    }
  }
  /**
   * @inheritDoc
   */
  execute() {
    const editor = this.editor;
    const model = editor.model;
    let mermaidItem;
    model.change((writer) => {
      mermaidItem = writer.createElement("mermaid", {
        displayMode: "split",
        source: MOCK_MERMAID_MARKUP
      });
      model.insertContent(mermaidItem);
    });
    return mermaidItem;
  }
}
const DEBOUNCE_TIME = 300;
class MermaidEditing extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "MermaidEditing";
  }
  /**
   * @inheritDoc
   */
  init() {
    this._registerCommands();
    this._defineConverters();
  }
  /**
   * @inheritDoc
   */
  afterInit() {
    mermaid.initialize({
      startOnLoad: false
    });
    this.editor.model.schema.register("mermaid", {
      allowAttributes: ["displayMode", "source"],
      allowWhere: "$block",
      isObject: true
    });
  }
  /**
   * @inheritDoc
  */
  _registerCommands() {
    const editor = this.editor;
    editor.commands.add("mermaidPreviewCommand", new MermaidPreviewCommand(editor));
    editor.commands.add("mermaidSplitViewCommand", new MermaidSplitViewCommand(editor));
    editor.commands.add("mermaidSourceViewCommand", new MermaidSourceViewCommand(editor));
    editor.commands.add("insertMermaidCommand", new InsertMermaidCommand(editor));
  }
  /**
   * Adds converters.
   */
  _defineConverters() {
    const editor = this.editor;
    editor.data.downcastDispatcher.on("insert:mermaid", this._mermaidDataDowncast.bind(this));
    editor.editing.downcastDispatcher.on("insert:mermaid", this._mermaidDowncast.bind(this));
    editor.editing.downcastDispatcher.on("attribute:source:mermaid", this._sourceAttributeDowncast.bind(this));
    editor.data.upcastDispatcher.on("element:code", this._mermaidUpcast.bind(this), { priority: "high" });
    editor.conversion.for("editingDowncast").attributeToAttribute({
      model: {
        name: "mermaid",
        key: "displayMode"
      },
      view: (modelAttributeValue) => ({
        key: "class",
        value: "ck-mermaid__" + modelAttributeValue + "-mode"
      })
    });
  }
  _mermaidDataDowncast(evt, data, conversionApi) {
    const model = this.editor.model;
    const { writer, mapper } = conversionApi;
    if (!conversionApi.consumable.consume(data.item, "insert")) {
      return;
    }
    const targetViewPosition = mapper.toViewPosition(model.createPositionBefore(data.item));
    const code = writer.createContainerElement("code", {
      class: "language-mermaid"
    });
    const pre = writer.createContainerElement("pre", {
      spellcheck: "false"
    });
    const sourceTextNode = writer.createText(data.item.getAttribute("source"));
    writer.insert(model.createPositionAt(code, "end"), sourceTextNode);
    writer.insert(model.createPositionAt(pre, "end"), code);
    writer.insert(targetViewPosition, pre);
    mapper.bindElements(data.item, code);
  }
  _mermaidDowncast(evt, data, conversionApi) {
    const { writer, mapper, consumable } = conversionApi;
    const { editor } = this;
    const { model, t } = editor;
    const that = this;
    if (!consumable.consume(data.item, "insert")) {
      return;
    }
    const targetViewPosition = mapper.toViewPosition(model.createPositionBefore(data.item));
    const wrapperAttributes = {
      class: ["ck-mermaid__wrapper"]
    };
    const textareaAttributes = {
      class: ["ck-mermaid__editing-view"],
      placeholder: t("Insert mermaid source code"),
      "data-cke-ignore-events": true
    };
    const wrapper = writer.createContainerElement("div", wrapperAttributes);
    const editingContainer = writer.createUIElement("textarea", textareaAttributes, createEditingTextarea);
    const previewContainer = writer.createUIElement("div", { class: ["ck-mermaid__preview"] }, createMermaidPreview);
    writer.insert(writer.createPositionAt(wrapper, "start"), previewContainer);
    writer.insert(writer.createPositionAt(wrapper, "start"), editingContainer);
    writer.insert(targetViewPosition, wrapper);
    mapper.bindElements(data.item, wrapper);
    return toWidget(wrapper, writer, {
      label: t("Mermaid widget"),
      hasSelectionHandle: true
    });
    function createEditingTextarea(domDocument) {
      const domElement = this.toDomElement(domDocument);
      domElement.value = data.item.getAttribute("source");
      const debouncedListener = debounce((event) => {
        editor.model.change((writer2) => {
          writer2.setAttribute("source", event.target.value, data.item);
        });
      }, DEBOUNCE_TIME);
      domElement.addEventListener("input", debouncedListener);
      domElement.addEventListener("focus", () => {
        const model2 = editor.model;
        const selectedElement = model2.document.selection.getSelectedElement();
        if (selectedElement !== data.item) {
          model2.change((writer2) => writer2.setSelection(data.item, "on"));
        }
      }, true);
      return domElement;
    }
    function createMermaidPreview(domDocument) {
      const mermaidSource = data.item.getAttribute("source");
      const domElement = this.toDomElement(domDocument);
      that._renderMermaid(domElement, mermaidSource);
      return domElement;
    }
  }
  _sourceAttributeDowncast(evt, data, conversionApi) {
    const newSource = data.attributeNewValue;
    const domConverter = this.editor.editing.view.domConverter;
    if (newSource) {
      const mermaidView = conversionApi.mapper.toViewElement(data.item);
      for (const child of mermaidView.getChildren()) {
        if (child.name === "textarea" && child.hasClass("ck-mermaid__editing-view")) {
          const domEditingTextarea = domConverter.viewToDom(child, window.document);
          if (domEditingTextarea.value != newSource) {
            domEditingTextarea.value = newSource;
          }
        } else if (child.name === "div" && child.hasClass("ck-mermaid__preview")) {
          const domPreviewWrapper = domConverter.viewToDom(child, window.document);
          if (domPreviewWrapper) {
            this._renderMermaid(domPreviewWrapper, newSource);
          }
        }
      }
    }
  }
  _mermaidUpcast(evt, data, conversionApi) {
    const viewCodeElement = data.viewItem;
    const hasPreElementParent = !viewCodeElement.parent || !viewCodeElement.parent.is("element", "pre");
    const hasCodeAncestors = data.modelCursor.findAncestor("code");
    const { consumable, writer } = conversionApi;
    if (!viewCodeElement.hasClass("language-mermaid") || hasPreElementParent || hasCodeAncestors) {
      return;
    }
    if (!consumable.test(viewCodeElement, { name: true })) {
      return;
    }
    const mermaidSource = Array.from(viewCodeElement.getChildren()).filter((item) => item.is("$text")).map((item) => item.data).join("");
    const mermaidElement = writer.createElement("mermaid", {
      source: mermaidSource,
      displayMode: "split"
    });
    if (!conversionApi.safeInsert(mermaidElement, data.modelCursor)) {
      return;
    }
    consumable.consume(viewCodeElement, { name: true });
    conversionApi.updateConversionResult(mermaidElement, data);
  }
  /**
   * Renders Mermaid (a parsed `source`) in a given `domElement`.
   */
  _renderMermaid(domElement, source) {
    const id = `ck-mermaid-${uid()}`;
    return mermaid.render(id, source).then(({ svg }) => {
      domElement.innerHTML = svg;
    }).catch((err) => {
      domElement.innerText = err.message;
      global.document.getElementById(id).parentNode.remove();
    });
  }
}
class MermaidToolbar extends Plugin {
  /**
   * @inheritDoc
   */
  static get requires() {
    return [WidgetToolbarRepository];
  }
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "MermaidToolbar";
  }
  /**
   * @inheritDoc
   */
  afterInit() {
    const editor = this.editor;
    const t = editor.t;
    const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);
    const mermaidToolbarItems = ["mermaidSourceView", "mermaidSplitView", "mermaidPreview", "|", "mermaidInfo"];
    if (mermaidToolbarItems) {
      widgetToolbarRepository.register("mermaidToolbar", {
        ariaLabel: t("Mermaid toolbar"),
        items: mermaidToolbarItems,
        getRelatedElement: (selection) => getSelectedElement(selection)
      });
    }
  }
}
function getSelectedElement(selection) {
  const viewElement = selection.getSelectedElement();
  if (viewElement && viewElement.hasClass("ck-mermaid__wrapper")) {
    return viewElement;
  }
  return null;
}
const insertMermaidIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="m8 11.5 3.004-3.004 3.003 3.004-3.003 3.004z"/><path fill-rule="evenodd" d="M9.504 2.863v3h3v-3zm-1 4h5v-5h-5z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M11.004 14.504 8 11.5l2.504-2.504V6.07h1v2.926l2.503 2.504zM9.414 11.5l1.59-1.59 1.59 1.59-1.59 1.59zM6.837 4.999h2.625v-1h-2.57a2.5 2.5 0 1 0-2.974 2.814V9h-2v5h5V9h-2V6.813c.934-.19 1.68-.9 1.919-1.814m-3.919-.636a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m0 5.637v3h3v-3z" clip-rule="evenodd"/></svg>`;
const previewModeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M13.8 11.609V13.4a.4.4 0 0 1-.4.4H2.6a.4.4 0 0 1-.4-.4v-1.791H1V13.4A1.6 1.6 0 0 0 2.6 15h10.8a1.6 1.6 0 0 0 1.6-1.6v-1.791zm0-6.612H15V2.6A1.6 1.6 0 0 0 13.4 1H2.6A1.6 1.6 0 0 0 1 2.6v2.397h1.2V2.6c0-.22.18-.4.4-.4h10.8c.22 0 .4.18.4.4z"/><path d="M8 11.095q-2.88 0-5.749-2.757L2 8.095l.251-.242c3.815-3.677 7.683-3.677 11.498 0l.251.242-.251.243Q10.886 11.095 8 11.096Zm-5.02-3c3.375 3.1 6.665 3.1 10.04 0-3.375-3.1-6.665-3.095-10.04 0"/><path fill-rule="evenodd" d="M13.514 8.095Q8 13.41 2.486 8.095q5.514-5.313 11.028 0m-3.586 0A1.926 1.926 0 0 1 8 10.02a1.926 1.926 0 0 1-1.928-1.924c0-1.062.863-1.924 1.928-1.924s1.928.862 1.928 1.924Z" clip-rule="evenodd"/><path d="M8 8.861a.767.767 0 1 0 .002-1.533A.767.767 0 0 0 8 8.86Z"/></svg>`;
const splitModeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill-rule="evenodd" d="M13.8 3.076H8.588V13.8H13.4a.4.4 0 0 0 .4-.4zm-6.412 0H2.2V13.4c0 .22.18.4.4.4h4.788zM2.6 1A1.6 1.6 0 0 0 1 2.6v10.8A1.6 1.6 0 0 0 2.6 15h10.8a1.6 1.6 0 0 0 1.6-1.6V2.6A1.6 1.6 0 0 0 13.4 1z" clip-rule="evenodd"/></svg>`;
const sourceModeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M11.609 2.2H13.4c.22 0 .4.18.4.4v10.8a.4.4 0 0 1-.4.4h-1.791V15H13.4a1.6 1.6 0 0 0 1.6-1.6V2.6A1.6 1.6 0 0 0 13.4 1h-1.791zm-6.612 0V1H2.6A1.6 1.6 0 0 0 1 2.6v10.8A1.6 1.6 0 0 0 2.6 15h2.397v-1.2H2.6a.4.4 0 0 1-.4-.4V2.6c0-.22.18-.4.4-.4z"/><path d="M3.511 4.778a.75.75 0 0 1 .75-.75h3.697a.75.75 0 1 1 0 1.5H4.26a.75.75 0 0 1-.75-.75Zm3.084 2.851a.75.75 0 0 1 .75-.75h3.588a.75.75 0 0 1 0 1.5H7.345a.75.75 0 0 1-.75-.75m0 2.851a.75.75 0 0 1 .75-.75h1.143a.75.75 0 1 1 0 1.5H7.345a.75.75 0 0 1-.75-.75M3.511 7.629a.75.75 0 0 1 .75-.75h.983a.75.75 0 1 1 0 1.5h-.983a.75.75 0 0 1-.75-.75m0 2.851a.75.75 0 0 1 .75-.75h.983a.75.75 0 1 1 0 1.5h-.983a.75.75 0 0 1-.75-.75"/></svg>`;
const infoIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M8 1.219C4.254 1.219 1.219 4.28 1.219 8A6.78 6.78 0 0 0 8 14.781c3.719 0 6.781-3.035 6.781-6.781 0-3.719-3.062-6.781-6.781-6.781m0 12.25A5.45 5.45 0 0 1 2.531 8 5.467 5.467 0 0 1 8 2.531c3.008 0 5.469 2.461 5.469 5.469A5.467 5.467 0 0 1 8 13.469m0-9.242c-.656 0-1.148.52-1.148 1.148 0 .656.492 1.148 1.148 1.148.629 0 1.148-.492 1.148-1.148 0-.629-.52-1.148-1.148-1.148m1.531 6.945v-.656a.35.35 0 0 0-.328-.329h-.328V7.454a.35.35 0 0 0-.328-.328h-1.75a.33.33 0 0 0-.328.328v.656c0 .192.136.329.328.329h.328v1.75h-.328a.333.333 0 0 0-.328.328v.656c0 .191.136.328.328.328h2.406a.33.33 0 0 0 .328-.328Z"/></svg>`;
class MermaidUI extends Plugin {
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "MermaidUI";
  }
  /**
   * @inheritDoc
   */
  init() {
    this._addButtons();
  }
  /**
   * Adds all mermaid-related buttons.
   *
   * @private
   */
  _addButtons() {
    const editor = this.editor;
    this._addInsertMermaidButton();
    this._addMermaidInfoButton();
    this._createToolbarButton(editor, "mermaidPreview", "Preview", previewModeIcon);
    this._createToolbarButton(editor, "mermaidSourceView", "Source view", sourceModeIcon);
    this._createToolbarButton(editor, "mermaidSplitView", "Split view", splitModeIcon);
  }
  /**
   * Adds the button for inserting mermaid.
   *
   * @private
   */
  _addInsertMermaidButton() {
    const editor = this.editor;
    const t = editor.t;
    const view = editor.editing.view;
    editor.ui.componentFactory.add("mermaid", (locale) => {
      const buttonView = new ButtonView(locale);
      const command = editor.commands.get("insertMermaidCommand");
      buttonView.set({
        label: t("Insert Mermaid diagram"),
        icon: insertMermaidIcon,
        tooltip: true
      });
      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");
      command.listenTo(buttonView, "execute", () => {
        const mermaidItem = editor.execute("insertMermaidCommand");
        const mermaidItemViewElement = editor.editing.mapper.toViewElement(mermaidItem);
        view.scrollToTheSelection();
        view.focus();
        if (mermaidItemViewElement) {
          const mermaidItemDomElement = view.domConverter.viewToDom(mermaidItemViewElement, document);
          if (mermaidItemDomElement) {
            mermaidItemDomElement.querySelector(".ck-mermaid__editing-view").focus();
          }
        }
      });
      return buttonView;
    });
  }
  /**
   * Adds the button linking to the mermaid guide.
   */
  _addMermaidInfoButton() {
    const editor = this.editor;
    const t = editor.t;
    editor.ui.componentFactory.add("mermaidInfo", (locale) => {
      const buttonView = new ButtonView(locale);
      const link = "https://ckeditor.com/blog/basic-overview-of-creating-flowcharts-using-mermaid/";
      buttonView.set({
        label: t("Read more about Mermaid diagram syntax"),
        icon: infoIcon,
        tooltip: true
      });
      buttonView.on("execute", () => {
        window.open(link, "_blank", "noopener");
      });
      return buttonView;
    });
  }
  /**
   * Adds the mermaid balloon toolbar button.
   */
  _createToolbarButton(editor, name, label, icon) {
    const t = editor.t;
    editor.ui.componentFactory.add(name, (locale) => {
      const buttonView = new ButtonView(locale);
      const command = editor.commands.get(`${name}Command`);
      buttonView.set({
        label: t(label),
        icon,
        tooltip: true
      });
      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");
      command.listenTo(buttonView, "execute", () => {
        editor.execute(`${name}Command`);
        editor.editing.view.scrollToTheSelection();
        editor.editing.view.focus();
      });
      return buttonView;
    });
  }
}
class Mermaid extends Plugin {
  /**
   * @inheritDoc
   */
  static get requires() {
    return [MermaidEditing, MermaidToolbar, MermaidUI];
  }
  /**
   * @inheritDoc
   */
  static get pluginName() {
    return "Mermaid";
  }
}
export {
  Mermaid
};
