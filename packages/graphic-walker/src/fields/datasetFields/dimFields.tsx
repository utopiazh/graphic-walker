import React from 'react';
import { Draggable, DroppableProvided } from '@kanaries/react-beautiful-dnd';
import { observer } from 'mobx-react-lite';
import { useGlobalStore } from '../../store';
import DataTypeIcon from '../../components/dataTypeIcon';
import { FieldPill } from './fieldPill';
import { fixDraggableOffset } from '../../pitch/dnd-offset';

interface Props {
    provided: DroppableProvided;
}
const DimFields: React.FC<Props> = props => {
    const { provided } = props;
    const { vizStore, commonStore } = useGlobalStore();
    const dimensions = vizStore.draggableFieldState.dimensions;
    return <div {...provided.droppableProps} ref={provided.innerRef}>
        {dimensions.map((f, index) => (
            <Draggable key={f.dragId} draggableId={f.dragId} index={index}>
                {(provided, snapshot) => {
                    if (snapshot.isDragging && provided.draggableProps.style) {
                        fixDraggableOffset(provided, commonStore.rootContainer)
                    }
          
                    return (
                        <>
                            <FieldPill
                                className="pt-0.5 pb-0.5 pl-2 pr-2 mx-0 m-1 text-xs hover:bg-blue-100 rounded-full truncate border border-transparent"
                                ref={provided.innerRef}
                                isDragging={snapshot.isDragging}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <DataTypeIcon dataType={f.semanticType} analyticType={f.analyticType} /> {f.name}&nbsp;
                            </FieldPill>
                            {
                                <FieldPill className={`pt-0.5 pb-0.5 pl-2 pr-2 mx-0 m-1 text-xs hover:bg-blue-100 rounded-full border-blue-400 border truncate ${snapshot.isDragging ? '' : 'hidden'}`}
                                isDragging={snapshot.isDragging}
                                >
                                    <DataTypeIcon dataType={f.semanticType} analyticType={f.analyticType} /> {f.name}&nbsp;
                                </FieldPill>
                            }
                        </>
                    );
                }}
            </Draggable>
        ))}
    </div>
}

export default observer(DimFields);
