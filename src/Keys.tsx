import { useState } from 'react';
import { IItem } from './index';

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const [draft, setDraft] = useState<string>('');

    const [names, setNames] = useState<Record<number, string>>(() => {
        const map: Record<number, string> = {};
        props.initialData.forEach((item) => {
            map[item.id] = item.name;
        });
        return map;
    });

    const startEditing = (item: IItem) => {
        setEditingId(item.id);
        setDraft(names[item.id] ?? item.name);
    };

    const save = () => {
        if (editingId === null) return;
        setNames((prev) => ({ ...prev, [editingId]: draft }));
        setEditingId(null);
    };

    const cancel = () => {
        setEditingId(null);
        setDraft('');
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            save();
        } else if (e.key === 'Escape') {
            cancel();
        }
    };

    const sorted = [...props.initialData].sort((a, b) =>
        props.sorting === 'ASC' ? a.id - b.id : b.id - a.id,
    );

    return (
        <ul>
            {sorted.map((item) => (
                <li key={item.id}>
                    {editingId === item.id ? (
                        <input
                            autoFocus
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={onKeyDown}
                            onBlur={save}
                        />
                    ) : (
                        <span onClick={() => startEditing(item)}>
                            {names[item.id] ?? item.name}
                        </span>
                    )}
                </li>
            ))}
        </ul>
    );
}
