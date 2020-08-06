import { init, h } from 'snabbdom';
import style from 'snabbdom/modules/style';
import eventlistener from 'snabbdom/modules/eventlisteners';
import classModule from 'snabbdom/modules/class';
import "./index.css"
const patch = init([style, eventlistener, classModule]);
let index = 11;
let sortBy = "rank";
const initData = [
    { rank: 1, title: 'The Shawshank Redemption', desc: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', elmHeight: 0 },
    { rank: 2, title: 'The Godfather', desc: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', elmHeight: 0 },
    { rank: 3, title: 'The Godfather: Part II', desc: 'The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba.', elmHeight: 0 },
    { rank: 4, title: 'The Dark Knight', desc: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological tests of his ability to fight injustice.', elmHeight: 0 },
    { rank: 5, title: 'Pulp Fiction', desc: 'The lives of two mob hit men, a boxer, a gangster\'s wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', elmHeight: 0 },
    { rank: 6, title: 'Schindler\'s List', desc: 'In Poland during World War II, Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.', elmHeight: 0 },
    { rank: 7, title: '12 Angry Men', desc: 'A dissenting juror in a murder trial slowly manages to convince the others that the case is not as obviously clear as it seemed in court.', elmHeight: 0 },
    { rank: 8, title: 'The Good, the Bad and the Ugly', desc: 'A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.', elmHeight: 0 },
    { rank: 9, title: 'The Lord of the Rings: The Return of the King', desc: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.', elmHeight: 0 },
    { rank: 10, title: 'Fight Club', desc: 'An insomniac office worker looking for a way to change his life crosses paths with a devil-may-care soap maker and they form an underground fight club that evolves into something much, much more...', elmHeight: 0 },
];
let dataToShow = JSON.parse(JSON.stringify(initData));

const getA = (classNames, content, clickHandler) => {
    const first = "a.btn." + classNames.join(".");
    return h(first, {
        on: {
            click: clickHandler
        },
        class: {
            active: sortBy === classNames[0] || undefined
        }
    }, content);
}

const getContentDiv = (content, classNames, clickHandler, index) => {
    classNames = classNames ? "div." + classNames.join(".") : "div";
    if (clickHandler) {
        return h(classNames, {
            on: {
                click: () => clickHandler(index)
            }
        }, content);
    } else {
        return h(classNames, content)
    }

}

const addFn = () => {
    var n = initData[Math.floor(Math.random() * 10)];
    dataToShow = [{ rank: index++, title: n.title, desc: n.desc }, ...dataToShow];
    oldNode = patch(oldNode, formVnode());
}

const removeFn = (index) => {
    dataToShow.splice(index, 1);
    oldNode = patch(oldNode, formVnode());
}

const sort = (key) => {
    sortBy = key;
    dataToShow.sort((a, b) => a[key] < b[key] ? -1 : 1);
    oldNode = patch(oldNode, formVnode());
}

//标题区域
const h1 = h("h1", "Top 10 movies");
//排序按钮区域
const formSortPanelSpan = () => h("span.btn-group", [getA(["rank"], "Rank", () => sort("rank")), getA(["title"], "Title", () => sort("title")), getA(["desc"], "Description", () => sort("desc"))]);
const formSortPanel = () => h("div", [getA(["add"], "Add", addFn), "Sort by：", formSortPanelSpan()]);
//list展示区域


let totalHeight = 0;
const formListItem = (data, index) => {
    return h("div.row", {
        key: data.rank,
        style: {
            opacity: '0',
            transform: 'translate(-100%,0)',
            delayed: { opacity: '1', transform: `translate(0,0)` },
            remove: { opacity: '0', transform: `translate(100%,0)` }
        },
    }, [getContentDiv(data.rank, ["list-rank"]), getContentDiv(data.title), getContentDiv(data.desc), getContentDiv("X", ["btn", "rm-btn"], removeFn, index)])
}
const formList = () => h("div.list", dataToShow.map((item, index) => formListItem(item, index)));

let formVnode = () => h("div#container.cls", {}, [
    h1,
    formSortPanel(),
    formList()
])
const app = document.querySelector("#app");
let oldNode = patch(app, formVnode());