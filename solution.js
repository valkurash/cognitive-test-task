// Само задание на https://gist.github.com/xanf/64eb6bb8d967631a8ec6b3c22cf3cbcc

function drawNestedSetsTree(data, node) {

  function render(data, node) {
    const ul = document.createElement('ul');
    let input = data.sort((a, b) => a.left - b.left);
    input.forEach(element => {
      const li = document.createElement('li');
      li.innerHTML = element.title;
      if (element.right - element.left == 1) {
        ul.appendChild(li);
      } else {
        let filtered = input.filter(filteredElement => filteredElement.left > element.left && filteredElement.right < element.right);
        input.splice(0, filtered.length);
        render(filtered, li);
        ul.appendChild(li);
      }

    });
    node.appendChild(ul);
  }

  function getChildText(node) {
    var text = "";
    for (var child = node.firstChild; !!child; child = child.nextSibling) {
      if (child.nodeType === 3) {
        text += child.nodeValue;
      }
    }
    return text;
  }

  function handleNode(node, previousLeft, set) {

    if (node.nodeType === 3) {
      return previousLeft;
    }
    if (node.tagName === 'UL') {
      var lastRight = previousLeft;
      Array.prototype.forEach.call(node.childNodes, child => {
        lastRight = handleNode(child, lastRight, set);
      });
      return lastRight;
    }
    var indexed = {};
    set.push(indexed);

    indexed.title = getChildText(node);
    indexed.left = previousLeft + 1;

    var lastRight = indexed.left;

    /* recursion for every child */
    Array.prototype.forEach.call(node.childNodes, child => {
      lastRight = handleNode(child, lastRight, set);
    });

    /* once all children have been iterated over -> store the rigth */
    indexed.right = lastRight + 1;

    /* return the newly updated right for this bucket */
    return indexed.right;


  }

  function save() {
    var set = [];
    handleNode(node.firstElementChild, 0, set);
    console.log(set);
  }

  // DnD features
  var dragSrcEl = null;

  function handleDragStart(e) {

    if (e.stopPropagation) {
      e.stopPropagation(); // Stops some browsers from redirecting.
    }
    // Target (this) element is the source node.
    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.outerHTML);
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault(); // Necessary. Allows us to drop.
    }

    e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.

    return false;
  }

  function handleDrop(e) {
    // this/e.target is current target element.

    if (e.stopPropagation) {
      e.stopPropagation(); // Stops some browsers from redirecting.
    }
    if (!dragSrcEl.contains(this) && dragSrcEl != this) {

      var innerUl = this.firstElementChild,
        parent, dropHTML, dropElem;
      if (innerUl && innerUl.tagName === 'UL') {
        parent = dragSrcEl.parentNode;
        parent.removeChild(dragSrcEl);
        dropHTML = e.dataTransfer.getData('text/html');
        innerUl.insertAdjacentHTML('beforeEnd', dropHTML);
        dropElem = innerUl.lastChild;

      } else {
        parent = dragSrcEl.parentNode;
        parent.removeChild(dragSrcEl);
        dropHTML = e.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('afterEnd', dropHTML);
        dropElem = this.nextSibling;
      }
      addDnDHandlers(dropElem);
      Array.prototype.forEach.call(dropElem.querySelectorAll('li'), addDnDHandlers);
      if (parent.innerHTML === "") {
        parent.remove();
      }

    }

    return false;
  }

  function handleDblcLick(e) {
    if (this.parentNode === node.firstElementChild) {
      return false;
    }
    if (e.stopPropagation) {
      e.stopPropagation(); // Stops some browsers from redirecting.
    }

    var innerUl = this.firstElementChild;
    if (innerUl && innerUl.tagName === 'UL') {
      while (innerUl.childNodes.length) {
        this.parentNode.insertBefore(innerUl.childNodes[0], this)
      }
    }
    this.remove();


  }

  function addDnDHandlers(elem) {
    elem.setAttribute('draggable', true);
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('drop', handleDrop, false);
    elem.addEventListener('dblclick', handleDblcLick, false);
  }

  render(data, node);
  Array.prototype.forEach.call(node.querySelectorAll('li'), addDnDHandlers);

  return {
    save
  }
}


const data = [{
    title: "Одежда",
    left: 1,
    right: 22
  },
  {
    title: "Мужская",
    left: 2,
    right: 9
  },
  {
    title: "Женская",
    left: 10,
    right: 21
  },
  {
    title: "Костюмы",
    left: 3,
    right: 8
  },
  {
    title: "Платья",
    left: 11,
    right: 16
  },
  {
    title: "Юбки",
    left: 17,
    right: 18
  },
  {
    title: "Блузы",
    left: 19,
    right: 20
  },
  {
    title: "Брюки",
    left: 4,
    right: 5
  },
  {
    title: "Жакеты",
    left: 6,
    right: 7
  },
  {
    title: "Вечерние",
    left: 12,
    right: 13
  },
  {
    title: "Летние",
    left: 14,
    right: 15
  }
];
const data2 = [

  {
    title: "Одежда",
    left: 1,
    right: 22
  },
  {
    title: "Мужская",
    left: 2,
    right: 21
  },
  {
    title: "Костюмы",
    left: 3,
    right: 14
  },
  {
    title: "Жакеты",
    left: 4,
    right: 5
  },
  {
    title: "Брюки",
    left: 6,
    right: 7
  },
  {
    title: "Платья",
    left: 8,
    right: 13
  },
  {
    title: "Летние",
    left: 9,
    right: 10
  },
  {
    title: "Вечерние",
    left: 11,
    right: 12
  },
  {
    title: "Женская",
    left: 15,
    right: 20
  },
  {
    title: "Юбки",
    left: 16,
    right: 17
  },
  {
    title: "Блузы",
    left: 18,
    right: 19
  }

]

const node = document.getElementById('root');

const tree = drawNestedSetsTree(data, node);
// дергаем дерево, таскаем в нем узлы, удаляем и т.д.

const newTree = tree.save();
// в newTree лежат новые данные
