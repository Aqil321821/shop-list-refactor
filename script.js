const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearAll = document.querySelector('.btn-clear');
const itemFilter = document.querySelector('#filter');
const formBtn = document.querySelector('#add-btn');
let isEditMode = false;


// 14.show items from localStorage on the DOM
function displayItems() {
    const itemsFromStorage = getItemFromStorage();
    itemsFromStorage.forEach(item => addItemToDom(item));
    checkUI();
}

function addItem(e) {
    e.preventDefault();

    //1. whats typed in text form get its value and put in list with some basic validation
    const newItem = itemInput.value;
    // check if its not empty

    if (!newItem) {
        alert('Please add an item ');
        return;
    }

    //17.check for edit mode

    //we will remove that item from dom and LS and then re-add the new li with input value
    //grab that list item which we're editing using class .edit-mode then remove it
    if (isEditMode === true) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;



    }else{
        if(checkIfItemExists(newItem)===true){
            alert("This Item already Exist");
            return;

        }
    }

    // call function which creates li pass the input text and addtoDom
    addItemToDom(newItem);
    addItemToLocalStorage(newItem);



    itemInput.value = '';


    checkUI();

}

//11.add item to DOM

function addItemToDom(text) {

    // text is from input.value
    //2. now create an li and append the text node ( newItem ) within that li

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(text));


    /*3.now make a function and call it to create a button that btn has icon in it so make another function which creates icon and call it inside that create button  */
    const button = createButton('remove-item btn-link text-red');

    // 6.now put this button inside li
    li.appendChild(button);

    // 7.now put into ul on DOM
    itemList.appendChild(li);

}

//12.function to add item to localstorage
function addItemToLocalStorage(item) {

    // before that check if item is already exist in storage
    //this variable represents an array from storage
    const itemsFromStorage = getItemFromStorage();

    /* 
    when you retrieve data from local storage after parsing it with JSON.parse(), 
    and if the stored data was an array of objects that was
     previously saved as a JSON string, then you will indeed get back an array of objects.
    yahan is app me agar data saved hoga previosly to wo array of objects hi hoga 
    */
    itemsFromStorage.push(item);

    //    convert back to JSon string and add to local storage

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));


    // now call this function up in additem

}


// 13.get items from storage function 
// get items from storage and then to show on dom and will run on doc loaded

function getItemFromStorage() {
    let itemsFromStorage;
    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];

    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;

}




// 4.function for making a button it'll take classes for button 'X' btn inside li

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;


}

//5. function to make icon and append it within button

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


// 7.now create a function to remove the item from list
/*
  for this we'll use event delegtion so that when we click anywhere inside the ul (but on X ) it gets remove
  we'll check with if() clicked on X then remove it
  event delegation is that we add listener to parent and it will respond to childs
 */

/* 
   when we hit X the li remove, for this we have to check for classlist of target
   we'll navigate through the parentElement to remove li
 
   if condition is important to note here
 */
function onClickItem(e) {
    if (e.target.classList.contains('fa-xmark')) {
        removeItem(e.target.parentElement.parentElement);
    } else {

        setItemToEdit(e.target);

    }

}

function setItemToEdit(item) {
    isEditMode = true;
    itemList.querySelectorAll('li').forEach(item => {
        item.classList.remove("edit-mode");
    });

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = 'green';
    itemInput.value = item.innerText;

}



function removeItem(item) {
    if (confirm('Are You Sure To Remove ?')) {
        //remove from dom
        item.remove();

        //remove from storage
        removeItemFromStorage(item.innerText);

    }
    checkUI();
}


//18.function to prohibit the dublicate entry
function checkIfItemExists(item) {
    const itemsFromStorage = getItemFromStorage();
    return itemsFromStorage.includes(item);
}

//15,

/* 
is function me ham LS k array ko edit kr rahy hen 
jo pass hoa ha item wo remove krdo baki rakhy rakho
us k liye ham filter ka method use kren gy
filter ( hamen wo array return kr raha ha jisme wo element jo remove krna ha wo nahi ha )
hamen har wo elemnt new aray me return krdo jo k is test ko pass na kary
filter method return us a new array with deleted item removed
*/
function removeItemFromStorage(item) {
    let itemsFromStorage = getItemFromStorage();

    itemsFromStorage = itemsFromStorage.filter(i => i !== item);
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}


//  8.to claer all items 
function removeAll() {
    // itemList.innerHTML =' ';
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
    // 16.remov all from localstoarge
    // localStorage.removeItem('items');
    localStorage.clear();
    checkUI();


}


//9. hide "filter-items" and 'clear-All btn' when there are no list items
/* li is a collection of nodeList we can check if its lenght=0 then hide those things */
/* we'll create a function that we will run on some occasions to check UI */
function checkUI() {
    itemInput.value = '';
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clearAll.style.display = 'none';
        itemFilter.style.display = 'none';
    }
    else {
        clearAll.style.display = 'block';
        itemFilter.style.display = 'block';
    }
    formBtn.innerHTML = `<i class=''fa-solid fa-plus''></i>  + &nbsp;Add Item`;
    formBtn.style.backgroundColor = '#333';
    isEditMode = false;
}

/*10. make a function to search in items 
    remove those items which don't matches with list items
    take value types in filter and then make it LC 
    make all list items LC and comapre ..

*/

function filterItems(e) {
    const text = e.target.value.toLowerCase();
    //   access the list items 
    const items = itemList.querySelectorAll('li');
    //acces the text of each list item
    items.forEach(item => {
        const itemText = item.innerText.toLowerCase();
        //   now we have both texts , the one which is typed in and list item's text
        //now match both text using indexOf().
        // itemText.indexOf(text) if matches it returns true, if not returns -1
        // itemText.indexOf(text) !=-1 means it gets matches
        // jo match kr raha ho uska display flex krdo or jo nahi uska none
        if (itemText.indexOf(text) != -1) {
            item.style.display = 'flex';

        } else {
            item.style.display = 'none';
        }
    });
}

// 11.now implement local storage
/* 
for this we make two functions one will add item to DOM and other will add it to LocalStorage

*/


















function init() {
    // all event listeners on project

    //1. when we click on button of the form ,new item gets put on list
    itemForm.addEventListener('submit', addItem);

    //2.remove listener
    itemList.addEventListener('click', onClickItem);

    //3.claer all btn
    clearAll.addEventListener('click', removeAll);

    //5.search 
    itemFilter.addEventListener('input', filterItems);

    // 6.get item frm storage and dispaly on page
    document.addEventListener('DOMContentLoaded', displayItems);


    // 4.
    checkUI();

}

init();


