import React, { createContext, useEffect, useRef, useState } from 'react';
import { StyleSheetManager } from 'styled-components';
import root from 'react-shadow';
import { DOM } from '@kanaries/react-beautiful-dnd';
import { observer } from 'mobx-react-lite';
import App, { EditorProps } from './App';
import { StoreWrapper } from './store/index';
import { FieldsContextWrapper } from './fields/fieldsContext';

import './empty_sheet.css';
import tailwindStyle from "tailwindcss/tailwind.css?inline";
import style from './index.css?inline';


export const ShadowDomContext = createContext<{ root: ShadowRoot | null }>({ root: null });

export const GraphicWalker: React.FC<EditorProps> = observer(props => {
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const fixContainer = props.fixContainer ?? false;

    useEffect(() => {
        if (rootRef.current) {
            const shadowRoot = rootRef.current.shadowRoot!;
            setShadowRoot(shadowRoot);
            DOM.setBody(shadowRoot);
            DOM.setHead(shadowRoot);
            return () => {
                DOM.setBody(document.body);
                DOM.setHead(document.head);
            };
        }
    }, []);

    return (
        <root.div mode="open" ref={rootRef}>
            <style>{tailwindStyle}</style>
            <style>{style}</style>
            {shadowRoot && (
                <StyleSheetManager target={shadowRoot}>
                    <StoreWrapper keepAlive={props.keepAlive} rootContainer={fixContainer ? rootRef.current : null}>
                        <FieldsContextWrapper>
                            <ShadowDomContext.Provider value={{ root: shadowRoot }}>
                                <App {...props} />
                            </ShadowDomContext.Provider>
                        </FieldsContextWrapper>
                    </StoreWrapper>
                </StyleSheetManager>
            )}
        </root.div>
    );
});
