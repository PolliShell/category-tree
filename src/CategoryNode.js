import React, { useState } from 'react';

const CategoryNode = ({ category, addSubcategory, renameCategory, deleteCategory, toggleCollapse }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(category.name);

    const handleRename = () => {
        renameCategory(category.id, newName);
        setIsEditing(false);
    };

    return (
        <div style={{ marginLeft: 20 }}>
            {isEditing ? (
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRename}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleRename();
                        }
                    }}
                />
            ) : (
                <span onDoubleClick={() => setIsEditing(true)}>{category.name}</span>
            )}
            <button onClick={() => addSubcategory(category.id)}>Добавить подкатегорию</button>
            <button onClick={() => deleteCategory(category.id)}>Удалить</button>
            <button onClick={() => toggleCollapse(category.id)}>
                {category.isExpanded ? 'Свернуть' : 'Развернуть'}
            </button>
            {category.isExpanded && category.children && (
                <div>
                    {category.children.map((child) => (
                        <CategoryNode
                            key={child.id}
                            category={child}
                            addSubcategory={addSubcategory}
                            renameCategory={renameCategory}
                            deleteCategory={deleteCategory}
                            toggleCollapse={toggleCollapse}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryNode;
