import React, { useState, useEffect } from 'react';
import CategoryNode from './CategoryNode';
import { db } from './firebase';
import { collection, doc, getDoc, setDoc } from "firebase/firestore";

const CategoryTree = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(collection(db, "categories"), "root");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCategories([docSnap.data()]);
            } else {
                const rootCategory = { id: "root", name: "Root", children: [], isExpanded: true };
                await setDoc(docRef, rootCategory);
                setCategories([rootCategory]);
            }
        };
        fetchData();
    }, []);

    const saveCategories = async (categories) => {
        const docRef = doc(collection(db, "categories"), "root");
        await setDoc(docRef, categories[0]);
    };

    const addSubcategory = (parentId) => {
        const addCategoryRecursively = (nodes) => {
            return nodes.map(node => {
                if (node.id === parentId) {
                    const newCategory = {
                        id: new Date().getTime().toString(),
                        name: 'New Category',
                        children: [],
                        isExpanded: true,
                    };
                    return { ...node, children: [...node.children, newCategory] };
                } else if (node.children.length > 0) {
                    return { ...node, children: addCategoryRecursively(node.children) };
                } else {
                    return node;
                }
            });
        };

        setCategories(prevCategories => {
            const newCategories = addCategoryRecursively(prevCategories);
            saveCategories(newCategories);
            return newCategories;
        });
    };

    const renameCategory = (categoryId, newName) => {
        const renameCategoryRecursively = (nodes) => {
            return nodes.map(node => {
                if (node.id === categoryId) {
                    return { ...node, name: newName };
                } else if (node.children.length > 0) {
                    return { ...node, children: renameCategoryRecursively(node.children) };
                } else {
                    return node;
                }
            });
        };

        setCategories(prevCategories => {
            const newCategories = renameCategoryRecursively(prevCategories);
            saveCategories(newCategories);
            return newCategories;
        });
    };

    const deleteCategory = (categoryId) => {
        const deleteCategoryRecursively = (nodes) => {
            return nodes
                .filter(node => node.id !== categoryId)
                .map(node => {
                    if (node.children.length > 0) {
                        return { ...node, children: deleteCategoryRecursively(node.children) };
                    } else {
                        return node;
                    }
                });
        };

        setCategories(prevCategories => {
            const newCategories = deleteCategoryRecursively(prevCategories);
            saveCategories(newCategories);
            return newCategories;
        });
    };

    const toggleCollapse = (categoryId) => {
        const toggleCollapseRecursively = (nodes) => {
            return nodes.map(node => {
                if (node.id === categoryId) {
                    return { ...node, isExpanded: !node.isExpanded };
                } else if (node.children.length > 0) {
                    return { ...node, children: toggleCollapseRecursively(node.children) };
                } else {
                    return node;
                }
            });
        };

        setCategories(prevCategories => {
            const newCategories = toggleCollapseRecursively(prevCategories);
            saveCategories(newCategories);
            return newCategories;
        });
    };

    return (
        <div>
            {categories.length > 0 && categories.map(category => (
                <CategoryNode
                    key={category.id}
                    category={category}
                    addSubcategory={addSubcategory}
                    renameCategory={renameCategory}
                    deleteCategory={deleteCategory}
                    toggleCollapse={toggleCollapse}
                />
            ))}
            {categories.length === 0 && <div>Loading...</div>}
        </div>
    );
};

export default CategoryTree;
