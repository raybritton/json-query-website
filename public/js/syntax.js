const editor = document.getElementById('query');
const selectionOutput = document.getElementById('selection');

var queryText = '';

const KEYWORDS = ["select", "describe", "search", "distinct", "from", "keys", "values", "key", "value", "limit", "offset", "as", "json", "pretty", "case", "sensitive", "order", "by", "for", "with", "sum", "min", "max", "count", "desc", "element", "true", "false", "where", "any", "element", "null", "not", "is", "object", "array", "string", "boolean", "number"];
const OPERATORS = ["=", "#", "!", "<", ">"];

function getTextSegments(element) {
    const textSegments = [];
    Array.from(element.childNodes).forEach((node) => {
        switch(node.nodeType) {
            case Node.TEXT_NODE:
                textSegments.push({text: node.nodeValue, node});
                break;
                
            case Node.ELEMENT_NODE:
                textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                break;
                
            default:
                throw new Error(`Unexpected node type: ${node.nodeType}`);
        }
    });
    return textSegments;
}

editor.addEventListener('input', updateEditor);

function updateEditor() {
    const sel = window.getSelection();
    const textSegments = getTextSegments(editor);
    queryText = textSegments.map(({text}) => text).join('');
    let anchorIndex = null;
    let focusIndex = null;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        if (node === sel.anchorNode) {
            anchorIndex = currentIndex + sel.anchorOffset;
        }
        if (node === sel.focusNode) {
            focusIndex = currentIndex + sel.focusOffset;
        }
        currentIndex += text.length;
    });
    
    editor.innerHTML = renderText(queryText + ' '); //add space as hack to fix bug in renderText
    //where the last character isn't parsed
    
    restoreSelection(anchorIndex, focusIndex);
}

function restoreSelection(absoluteAnchorIndex, absoluteFocusIndex) {
    const sel = window.getSelection();
    const textSegments = getTextSegments(editor);
    let anchorNode = editor;
    let anchorIndex = 0;
    let focusNode = editor;
    let focusIndex = 0;
    let currentIndex = 0;
    textSegments.forEach(({text, node}) => {
        const startIndexOfNode = currentIndex;
        const endIndexOfNode = startIndexOfNode + text.length;
        if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
            anchorNode = node;
            anchorIndex = absoluteAnchorIndex - startIndexOfNode;
        }
        if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
            focusNode = node;
            focusIndex = absoluteFocusIndex - startIndexOfNode;
        }
        currentIndex += text.length;
    });
    
    sel.setBaseAndExtent(anchorNode,anchorIndex,focusNode,focusIndex);
}

function isOutsideString(text, position) {
  var quoteBefore = 0;
  var doubleQuoteBefore = 0;
  var quoteAfter = 0;
  var doubleQuoteAfter = 0;
  for (var i = 0; i < position; i++) {
    if (text[i] == "'") {
      quoteBefore++;
    }
    if (text[i] == '"') {
      doubleQuoteBefore++;
    }
  }
  for (var i = position+1; i < text.length; i++) {
    if (text[i] == "'") {
      quoteAfter++;
    }
    if (text[i] == '"') {
      doubleQuoteAfter++;
    }
  }
  return (quoteBefore % 2 == 0 && doubleQuoteBefore % 2 == 0) && (quoteAfter % 2 == 0 && doubleQuoteAfter % 2 == 0)
}

function renderText(text) {
  var isLetter = /[a-zA-Z]/;
  var words = [];
  var currentType = 'keyword'
  var currentWord = '';
  var startIdx = 0;
  var currentIdx = 0;
  [...text].forEach(c => {
    if (isLetter.test(c)) {
      if (currentWord.length == 0) {
        startIdx = currentIdx;
      }
      currentWord += c;
    } else {
      if (currentWord.length > 0) {
        words.push({
          type: currentType,
          word: currentWord,
          idx: startIdx
        });
        words.push({
          type: 'other',
          word: c,
          idx: currentIdx
        });
        currentWord = '';
      } else {
        words.push({
          type: 'other',
          word: c,
          idx: currentIdx
        });
      }
    }
    currentIdx++;
  });

  var output= words.map((data) => {
    if (data.type == 'keyword') {
      if (isOutsideString(text, data.idx) && KEYWORDS.includes(data.word.toLowerCase())) {
        return `<span style='color:blue'>${data.word}</span>`
      }
    }
    return data.word
  });
  
  return output.join('');
}

updateEditor();