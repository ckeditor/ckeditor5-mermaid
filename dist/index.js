import { Command, Plugin } from '@ckeditor/ckeditor5-core/dist/index.js';
import { toWidget, WidgetToolbarRepository } from '@ckeditor/ckeditor5-widget/dist/index.js';
import mermaid from 'mermaid/dist/mermaid.js';
import { debounce } from 'lodash-es';
import { ButtonView } from '@ckeditor/ckeditor5-ui/dist/index.js';

var infoIcon = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8 1.219C4.254 1.219 1.219 4.28 1.219 8A6.78 6.78 0 0 0 8 14.781c3.719 0 6.781-3.035 6.781-6.781 0-3.719-3.062-6.781-6.781-6.781Zm0 12.25A5.45 5.45 0 0 1 2.531 8 5.467 5.467 0 0 1 8 2.531c3.008 0 5.469 2.461 5.469 5.469A5.467 5.467 0 0 1 8 13.469Zm0-9.242c-.656 0-1.148.52-1.148 1.148 0 .656.492 1.148 1.148 1.148.629 0 1.148-.492 1.148-1.148 0-.629-.52-1.148-1.148-1.148Zm1.531 6.945v-.656a.353.353 0 0 0-.328-.329h-.328V7.454a.353.353 0 0 0-.328-.328h-1.75a.332.332 0 0 0-.328.328v.656c0 .192.136.329.328.329h.328v1.75h-.328a.333.333 0 0 0-.328.328v.656c0 .191.136.328.328.328h2.406a.332.332 0 0 0 .328-.328Z\"/></svg>\n";

var insertMermaidIcon = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m8 11.5 3.004-3.004 3.003 3.004-3.003 3.004L8 11.5Z\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M9.504 2.863v3h3v-3h-3Zm-1 4h5v-5h-5v5Z\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.004 14.504 8 11.5l2.504-2.504V6.07h1v2.926l2.503 2.504-3.003 3.004ZM9.414 11.5l1.59-1.59 1.59 1.59-1.59 1.59-1.59-1.59ZM6.837 4.999h2.625v-1h-2.57a2.5 2.5 0 1 0-2.974 2.814V9h-2v5h5V9h-2V6.813c.934-.19 1.68-.9 1.919-1.814Zm-3.919-.636a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm0 5.637v3h3v-3h-3Z\"/></svg>\n";

var previewModeIcon = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13.8 11.609V13.4a.4.4 0 0 1-.4.4H2.6a.4.4 0 0 1-.4-.4v-1.791H1V13.4A1.6 1.6 0 0 0 2.6 15h10.8a1.6 1.6 0 0 0 1.6-1.6v-1.791h-1.2ZM13.8 4.997H15V2.6A1.6 1.6 0 0 0 13.4 1H2.6A1.6 1.6 0 0 0 1 2.6v2.397h1.2V2.6c0-.22.18-.4.4-.4h10.8c.22 0 .4.18.4.4v2.397Z\"/><path d=\"M8 11.095c-1.92 0-3.837-.919-5.749-2.757L2 8.095l.251-.242c3.815-3.677 7.683-3.677 11.498 0l.251.242-.251.243C11.84 10.176 9.925 11.095 8 11.096Zm-5.02-3c3.375 3.1 6.665 3.1 10.04 0-3.375-3.1-6.665-3.095-10.04 0Z\"/><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M13.514 8.095c-3.676 3.543-7.352 3.543-11.028 0 3.676-3.542 7.352-3.542 11.028 0Zm-3.586 0A1.926 1.926 0 0 1 8 10.02a1.926 1.926 0 0 1-1.928-1.924c0-1.062.863-1.924 1.928-1.924s1.928.862 1.928 1.924Z\"/><path d=\"M8 8.861a.767.767 0 1 0 .002-1.533A.767.767 0 0 0 8 8.86Z\"/></svg>\n";

var splitModeIcon = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M13.8 3.076H8.588V13.8H13.4a.4.4 0 0 0 .4-.4V3.076Zm-6.412 0H2.2V13.4c0 .22.18.4.4.4h4.788V3.076ZM2.6 1A1.6 1.6 0 0 0 1 2.6v10.8A1.6 1.6 0 0 0 2.6 15h10.8a1.6 1.6 0 0 0 1.6-1.6V2.6A1.6 1.6 0 0 0 13.4 1H2.6Z\"/></svg>\n";

var sourceModeIcon = "<svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.609 2.2H13.4c.22 0 .4.18.4.4v10.8a.4.4 0 0 1-.4.4h-1.791V15H13.4a1.6 1.6 0 0 0 1.6-1.6V2.6A1.6 1.6 0 0 0 13.4 1h-1.791v1.2ZM4.997 2.2V1H2.6A1.6 1.6 0 0 0 1 2.6v10.8A1.6 1.6 0 0 0 2.6 15h2.397v-1.2H2.6a.4.4 0 0 1-.4-.4V2.6c0-.22.18-.4.4-.4h2.397Z\"/><path d=\"M3.511 4.778a.75.75 0 0 1 .75-.75h3.697a.75.75 0 1 1 0 1.5H4.26a.75.75 0 0 1-.75-.75ZM6.595 7.629a.75.75 0 0 1 .75-.75h3.588a.75.75 0 0 1 0 1.5H7.345a.75.75 0 0 1-.75-.75ZM6.595 10.48a.75.75 0 0 1 .75-.75h1.143a.75.75 0 1 1 0 1.5H7.345a.75.75 0 0 1-.75-.75ZM3.511 7.629a.75.75 0 0 1 .75-.75h.983a.75.75 0 1 1 0 1.5h-.983a.75.75 0 0 1-.75-.75ZM3.511 10.48a.75.75 0 0 1 .75-.75h.983a.75.75 0 1 1 0 1.5h-.983a.75.75 0 0 1-.75-.75Z\"/></svg>\n";

/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */ /**
 * @module mermaid/utils
 */ /**
 * Helper function for setting the `isOn` state of buttons.
 *
 * @private
 * @param {module:core/editor/editor~Editor} editor
 * @param {String} commandName Short name of the command.
 * @returns {Boolean}
 */ function checkIsOn(editor, commandName) {
    const selection = editor.model.document.selection;
    const mermaidItem = selection.getSelectedElement() || selection.getLastPosition().parent;
    if (mermaidItem && mermaidItem.is('element', 'mermaid') && mermaidItem.getAttribute('displayMode') === commandName) {
        return true;
    }
    return false;
}

/**
 * The mermaid preview command.
 *
 * Allows to switch to a preview mode.
 *
 * @extends module:core/command~Command
 */ class MermaidPreviewCommand extends Command {
    /**
	 * @inheritDoc
	 */ refresh() {
        const editor = this.editor;
        const documentSelection = editor.model.document.selection;
        const selectedElement = documentSelection.getSelectedElement();
        const isSelectedElementMermaid = selectedElement && selectedElement.name === 'mermaid';
        if (isSelectedElementMermaid || documentSelection.getLastPosition().findAncestor('mermaid')) {
            this.isEnabled = !!selectedElement;
        } else {
            this.isEnabled = false;
        }
        this.value = checkIsOn(editor, 'preview');
    }
    /**
	 * @inheritDoc
	 */ execute() {
        const editor = this.editor;
        const model = editor.model;
        const documentSelection = this.editor.model.document.selection;
        const mermaidItem = documentSelection.getSelectedElement() || documentSelection.getLastPosition().parent;
        model.change((writer)=>{
            if (mermaidItem.getAttribute('displayMode') !== 'preview') {
                writer.setAttribute('displayMode', 'preview', mermaidItem);
            }
        });
    }
}

/**
 * The mermaid source view command.
 *
 * Allows to switch to a source view mode.
 *
 * @extends module:core/command~Command
 */ class MermaidSourceViewCommand extends Command {
    /**
	 * @inheritDoc
	 */ refresh() {
        const editor = this.editor;
        const documentSelection = editor.model.document.selection;
        const selectedElement = documentSelection.getSelectedElement();
        const isSelectedElementMermaid = selectedElement && selectedElement.name === 'mermaid';
        if (isSelectedElementMermaid || documentSelection.getLastPosition().findAncestor('mermaid')) {
            this.isEnabled = !!selectedElement;
        } else {
            this.isEnabled = false;
        }
        this.value = checkIsOn(editor, 'source');
    }
    /**
	 * @inheritDoc
	 */ execute() {
        const editor = this.editor;
        const model = editor.model;
        const documentSelection = this.editor.model.document.selection;
        const mermaidItem = documentSelection.getSelectedElement() || documentSelection.getLastPosition().parent;
        model.change((writer)=>{
            if (mermaidItem.getAttribute('displayMode') !== 'source') {
                writer.setAttribute('displayMode', 'source', mermaidItem);
            }
        });
    }
}

/**
 * The mermaid split view command.
 *
 * Allows to switch to a split view mode.
 *
 * @extends module:core/command~Command
 */ class MermaidSplitViewCommand extends Command {
    /**
	 * @inheritDoc
	 */ refresh() {
        const editor = this.editor;
        const documentSelection = editor.model.document.selection;
        const selectedElement = documentSelection.getSelectedElement();
        const isSelectedElementMermaid = selectedElement && selectedElement.name === 'mermaid';
        if (isSelectedElementMermaid || documentSelection.getLastPosition().findAncestor('mermaid')) {
            this.isEnabled = !!selectedElement;
        } else {
            this.isEnabled = false;
        }
        this.value = checkIsOn(editor, 'split');
    }
    /**
	 * @inheritDoc
	 */ execute() {
        const editor = this.editor;
        const model = editor.model;
        const documentSelection = this.editor.model.document.selection;
        const mermaidItem = documentSelection.getSelectedElement() || documentSelection.getLastPosition().parent;
        model.change((writer)=>{
            if (mermaidItem.getAttribute('displayMode') !== 'split') {
                writer.setAttribute('displayMode', 'split', mermaidItem);
            }
        });
    }
}

const MOCK_MERMAID_MARKUP = `flowchart TB
A --> B
B --> C`;
/**
 * The insert mermaid command.
 *
 * Allows to insert mermaid.
 *
 * @extends module:core/command~Command
 */ class InsertMermaidCommand extends Command {
    /**
	 * @inheritDoc
	 */ refresh() {
        const documentSelection = this.editor.model.document.selection;
        const selectedElement = documentSelection.getSelectedElement();
        if (selectedElement && selectedElement.name === 'mermaid') {
            this.isEnabled = false;
        } else {
            this.isEnabled = true;
        }
    }
    /**
	 * @inheritDoc
	 */ execute() {
        const editor = this.editor;
        const model = editor.model;
        let mermaidItem;
        model.change((writer)=>{
            mermaidItem = writer.createElement('mermaid', {
                displayMode: 'split',
                source: MOCK_MERMAID_MARKUP
            });
            model.insertContent(mermaidItem);
        });
        return mermaidItem;
    }
}

// Time in milliseconds.
const DEBOUNCE_TIME = 300;
class MermaidEditing extends Plugin {
    /**
	 * @inheritDoc
	 */ static get pluginName() {
        return 'MermaidEditing';
    }
    /**
	 * @inheritDoc
	 */ init() {
        this._registerCommands();
        this._defineConverters();
    }
    /**
	 * @inheritDoc
	 */ afterInit() {
        this.editor.model.schema.register('mermaid', {
            allowAttributes: [
                'displayMode',
                'source'
            ],
            allowWhere: '$block',
            isObject: true
        });
    }
    /**
	 * @inheritDoc
	*/ _registerCommands() {
        const editor = this.editor;
        editor.commands.add('mermaidPreviewCommand', new MermaidPreviewCommand(editor));
        editor.commands.add('mermaidSplitViewCommand', new MermaidSplitViewCommand(editor));
        editor.commands.add('mermaidSourceViewCommand', new MermaidSourceViewCommand(editor));
        editor.commands.add('insertMermaidCommand', new InsertMermaidCommand(editor));
    }
    /**
	 * Adds converters.
	 *
	 * @private
	 */ _defineConverters() {
        const editor = this.editor;
        editor.data.downcastDispatcher.on('insert:mermaid', this._mermaidDataDowncast.bind(this));
        editor.editing.downcastDispatcher.on('insert:mermaid', this._mermaidDowncast.bind(this));
        editor.editing.downcastDispatcher.on('attribute:source:mermaid', this._sourceAttributeDowncast.bind(this));
        editor.data.upcastDispatcher.on('element:code', this._mermaidUpcast.bind(this), {
            priority: 'high'
        });
        editor.conversion.for('editingDowncast').attributeToAttribute({
            model: {
                name: 'mermaid',
                key: 'displayMode'
            },
            view: (modelAttributeValue)=>({
                    key: 'class',
                    value: 'ck-mermaid__' + modelAttributeValue + '-mode'
                })
        });
    }
    /**
	 *
	 * @private
	 * @param {*} evt
	 * @param {*} data
	 * @param {*} conversionApi
	 */ _mermaidDataDowncast(evt, data, conversionApi) {
        const model = this.editor.model;
        const { writer, mapper } = conversionApi;
        if (!conversionApi.consumable.consume(data.item, 'insert')) {
            return;
        }
        const targetViewPosition = mapper.toViewPosition(model.createPositionBefore(data.item));
        // For downcast we're using only language-mermaid class. We don't set class to `mermaid language-mermaid` as
        // multiple markdown converters that we have seen are using only `language-mermaid` class and not `mermaid` alone.
        const code = writer.createContainerElement('code', {
            class: 'language-mermaid'
        });
        const pre = writer.createContainerElement('pre', {
            spellcheck: 'false'
        });
        const sourceTextNode = writer.createText(data.item.getAttribute('source'));
        writer.insert(model.createPositionAt(code, 'end'), sourceTextNode);
        writer.insert(model.createPositionAt(pre, 'end'), code);
        writer.insert(targetViewPosition, pre);
        mapper.bindElements(data.item, code);
    }
    /**
	 *
	 * @private
	 * @param {*} evt
	 * @param {*} data
	 * @param {*} conversionApi
	 */ _mermaidDowncast(evt, data, conversionApi) {
        const { writer, mapper, consumable } = conversionApi;
        const { editor } = this;
        const { model, t } = editor;
        const that = this;
        if (!consumable.consume(data.item, 'insert')) {
            return;
        }
        const targetViewPosition = mapper.toViewPosition(model.createPositionBefore(data.item));
        const wrapperAttributes = {
            class: [
                'ck-mermaid__wrapper'
            ]
        };
        const textareaAttributes = {
            class: [
                'ck-mermaid__editing-view'
            ],
            placeholder: t('Insert mermaid source code'),
            'data-cke-ignore-events': true
        };
        const wrapper = writer.createContainerElement('div', wrapperAttributes);
        const editingContainer = writer.createUIElement('textarea', textareaAttributes, createEditingTextarea);
        const previewContainer = writer.createUIElement('div', {
            class: [
                'ck-mermaid__preview'
            ]
        }, createMermaidPreview);
        writer.insert(writer.createPositionAt(wrapper, 'start'), previewContainer);
        writer.insert(writer.createPositionAt(wrapper, 'start'), editingContainer);
        writer.insert(targetViewPosition, wrapper);
        mapper.bindElements(data.item, wrapper);
        return toWidget(wrapper, writer, {
            widgetLabel: t('Mermaid widget'),
            hasSelectionHandle: true
        });
        function createEditingTextarea(domDocument) {
            const domElement = this.toDomElement(domDocument);
            domElement.value = data.item.getAttribute('source');
            const debouncedListener = debounce((event)=>{
                editor.model.change((writer)=>{
                    writer.setAttribute('source', event.target.value, data.item);
                });
            }, DEBOUNCE_TIME);
            domElement.addEventListener('input', debouncedListener);
            /* Workaround for internal #1544 */ domElement.addEventListener('focus', ()=>{
                const model = editor.model;
                const selectedElement = model.document.selection.getSelectedElement();
                // Move the selection onto the mermaid widget if it's currently not selected.
                if (selectedElement !== data.item) {
                    model.change((writer)=>writer.setSelection(data.item, 'on'));
                }
            }, true);
            return domElement;
        }
        function createMermaidPreview(domDocument) {
            // Taking the text from the wrapper container element for now
            const mermaidSource = data.item.getAttribute('source');
            const domElement = this.toDomElement(domDocument);
            domElement.innerHTML = mermaidSource;
            window.setTimeout(()=>{
                // @todo: by the looks of it the domElement needs to be hooked to tree in order to allow for rendering.
                that._renderMermaid(domElement);
            }, 100);
            return domElement;
        }
    }
    /**
	 *
	 * @param {*} evt
	 * @param {*} data
	 * @param {*} conversionApi
	 * @returns
	 */ _sourceAttributeDowncast(evt, data, conversionApi) {
        // @todo: test whether the attribute was consumed.
        const newSource = data.attributeNewValue;
        const domConverter = this.editor.editing.view.domConverter;
        if (newSource) {
            const mermaidView = conversionApi.mapper.toViewElement(data.item);
            for (const child of mermaidView.getChildren()){
                if (child.name === 'textarea' && child.hasClass('ck-mermaid__editing-view')) {
                    const domEditingTextarea = domConverter.viewToDom(child, window.document);
                    if (domEditingTextarea.value != newSource) {
                        domEditingTextarea.value = newSource;
                    }
                } else if (child.name === 'div' && child.hasClass('ck-mermaid__preview')) {
                    // @todo: we could optimize this and not refresh mermaid if widget is in source mode.
                    const domPreviewWrapper = domConverter.viewToDom(child, window.document);
                    if (domPreviewWrapper) {
                        domPreviewWrapper.innerHTML = newSource;
                        domPreviewWrapper.removeAttribute('data-processed');
                        this._renderMermaid(domPreviewWrapper);
                    }
                }
            }
        }
    }
    /**
	 *
	 * @private
	 * @param {*} evt
	 * @param {*} data
	 * @param {*} conversionApi
	 */ _mermaidUpcast(evt, data, conversionApi) {
        const viewCodeElement = data.viewItem;
        const hasPreElementParent = !viewCodeElement.parent || !viewCodeElement.parent.is('element', 'pre');
        const hasCodeAncestors = data.modelCursor.findAncestor('code');
        const { consumable, writer } = conversionApi;
        if (!viewCodeElement.hasClass('language-mermaid') || hasPreElementParent || hasCodeAncestors) {
            return;
        }
        if (!consumable.test(viewCodeElement, {
            name: true
        })) {
            return;
        }
        const mermaidSource = Array.from(viewCodeElement.getChildren()).filter((item)=>item.is('$text')).map((item)=>item.data).join('');
        const mermaidElement = writer.createElement('mermaid', {
            source: mermaidSource,
            displayMode: 'split'
        });
        // Let's try to insert mermaid element.
        if (!conversionApi.safeInsert(mermaidElement, data.modelCursor)) {
            return;
        }
        consumable.consume(viewCodeElement, {
            name: true
        });
        conversionApi.updateConversionResult(mermaidElement, data);
    }
    /**
	 * Renders Mermaid in a given `domElement`. Expect this domElement to have mermaid
	 * source set as text content.
	 *
	 * @param {HTMLElement} domElement
	 */ _renderMermaid(domElement) {
        mermaid.init(undefined, domElement);
    }
}

class MermaidToolbar extends Plugin {
    /**
	 * @inheritDoc
	 */ static get requires() {
        return [
            WidgetToolbarRepository
        ];
    }
    /**
	 * @inheritDoc
	 */ static get pluginName() {
        return 'MermaidToolbar';
    }
    /**
	 * @inheritDoc
	 */ afterInit() {
        const editor = this.editor;
        const t = editor.t;
        const widgetToolbarRepository = editor.plugins.get(WidgetToolbarRepository);
        const mermaidToolbarItems = [
            'mermaidSourceView',
            'mermaidSplitView',
            'mermaidPreview',
            '|',
            'mermaidInfo'
        ];
        if (mermaidToolbarItems) {
            widgetToolbarRepository.register('mermaidToolbar', {
                ariaLabel: t('Mermaid toolbar'),
                items: mermaidToolbarItems,
                getRelatedElement: (selection)=>getSelectedElement(selection)
            });
        }
    }
}
function getSelectedElement(selection) {
    const viewElement = selection.getSelectedElement();
    if (viewElement && viewElement.hasClass('ck-mermaid__wrapper')) {
        return viewElement;
    }
    return null;
}

class MermaidUI extends Plugin {
    /**
	 * @inheritDoc
	 */ static get pluginName() {
        return 'MermaidUI';
    }
    /**
	 * @inheritDoc
	 */ init() {
        this._addButtons();
    }
    /**
	 * Adds all mermaid-related buttons.
	 *
	 * @private
	 */ _addButtons() {
        const editor = this.editor;
        this._addInsertMermaidButton();
        this._addMermaidInfoButton();
        this._createToolbarButton(editor, 'mermaidPreview', 'Preview', previewModeIcon);
        this._createToolbarButton(editor, 'mermaidSourceView', 'Source view', sourceModeIcon);
        this._createToolbarButton(editor, 'mermaidSplitView', 'Split view', splitModeIcon);
    }
    /**
	 * Adds the button for inserting mermaid.
	 *
	 * @private
	 */ _addInsertMermaidButton() {
        const editor = this.editor;
        const t = editor.t;
        const view = editor.editing.view;
        editor.ui.componentFactory.add('mermaid', (locale)=>{
            const buttonView = new ButtonView(locale);
            const command = editor.commands.get('insertMermaidCommand');
            buttonView.set({
                label: t('Insert Mermaid diagram'),
                icon: insertMermaidIcon,
                tooltip: true
            });
            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
            // Execute the command when the button is clicked.
            command.listenTo(buttonView, 'execute', ()=>{
                const mermaidItem = editor.execute('insertMermaidCommand');
                const mermaidItemViewElement = editor.editing.mapper.toViewElement(mermaidItem);
                view.scrollToTheSelection();
                view.focus();
                if (mermaidItemViewElement) {
                    const mermaidItemDomElement = view.domConverter.viewToDom(mermaidItemViewElement, document);
                    if (mermaidItemDomElement) {
                        mermaidItemDomElement.querySelector('.ck-mermaid__editing-view').focus();
                    }
                }
            });
            return buttonView;
        });
    }
    /**
	 * Adds the button linking to the mermaid guide.
	 *
	 * @private
	 */ _addMermaidInfoButton() {
        const editor = this.editor;
        const t = editor.t;
        editor.ui.componentFactory.add('mermaidInfo', (locale)=>{
            const buttonView = new ButtonView(locale);
            const link = 'https://ckeditor.com/blog/basic-overview-of-creating-flowcharts-using-mermaid/';
            buttonView.set({
                label: t('Read more about Mermaid diagram syntax'),
                icon: infoIcon,
                tooltip: true
            });
            buttonView.on('execute', ()=>{
                window.open(link, '_blank', 'noopener');
            });
            return buttonView;
        });
    }
    /**
	 * Adds the mermaid balloon toolbar button.
	 *
	 * @private
	 * @param {module:core/editor/editor~Editor} editor
	 * @param {String} name Name of the button.
	 * @param {String} label Label for the button.
	 * @param {String} icon The button icon.
	 */ _createToolbarButton(editor, name, label, icon) {
        const t = editor.t;
        editor.ui.componentFactory.add(name, (locale)=>{
            const buttonView = new ButtonView(locale);
            const command = editor.commands.get(`${name}Command`);
            buttonView.set({
                label: t(label),
                icon,
                tooltip: true
            });
            buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');
            // Execute the command when the button is clicked.
            command.listenTo(buttonView, 'execute', ()=>{
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
	 */ static get requires() {
        return [
            MermaidEditing,
            MermaidToolbar,
            MermaidUI
        ];
    }
    /**
	 * @inheritDoc
	 */ static get pluginName() {
        return 'Mermaid';
    }
}

const icons = {
    infoIcon,
    insertMermaidIcon,
    previewModeIcon,
    splitModeIcon,
    sourceModeIcon
};

export { Mermaid, icons };
//# sourceMappingURL=index.js.map
