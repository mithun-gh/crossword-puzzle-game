var root = document.getElementById('root');

class CrosswordQuestions extends React.Component {
    render() {
        const across = this.props.json.across.map((item, index) => {
            return <li key={index}>{item.desc}</li>;
        });
        const down = this.props.json.down.map((item, index) => {
            return <li key={index}>{item.desc}</li>;
        });
        return (
            <div className="crossword-questions">
                <p>ACROSS</p>
                <ol>{across}</ol>
                <p>DOWN</p>
                <ol>{down}</ol>
            </div>);
    }
}

class CrosswordBoard extends React.Component {
    constructor() {
        super();
        this.state = { puzzleJson: null };
    }

    createBoardEntries(x, y) {
        var entry, entries = [];

        for (let row = 0; row < y; row++) {
            entry = [];
            for (let col = 0; col < x; col++) {
                entry.push({
                    className: 'non-editable'
                });
            }
            entries.push(entry);
        }

        return entries;
    }

    prepareInput(entry, entries, isAcross) {
        var x = entry.x - 1,
            y = entry.y - 1;
        for (let i = 0; i < entry.length; i++) {
            let cell = entries[y][x];
            isAcross ? x++ : y++;
            cell.className = 'editable';
            cell.hintNumber = (i === 0) ? entry.number : cell.hintNumber;
        }
    }

    getBoardEntries(puzzle) {
        var entries = this.createBoardEntries(puzzle.sizeX, puzzle.sizeY);
        puzzle.across.forEach(entry => this.prepareInput(entry, entries, true));
        puzzle.down.forEach(entry => this.prepareInput(entry, entries, false));
        return entries;
    }

    componentWillMount() {
        var that = this, request = new XMLHttpRequest();
        request.onload = function () {
            that.setState({ puzzleJson: request.response });
        };
        request.open('GET', location.href + 'puzzles/puzzle1.json');
        request.responseType = 'json';
        request.send();
    }

    componentDidUpdate() {
        var targetCell = null,
            editableDivs = document.querySelectorAll('.editable'),
            inputDelegate = document.getElementById('input-delegate');

        editableDivs.forEach(div => {
            div.onclick = function (e) {
                if (targetCell !== null) {
                  targetCell.classList.remove('selected');
                }
                targetCell = e.target;
                targetCell.classList.add('selected');
                inputDelegate.focus();
                inputDelegate.setSelectionRange(0, inputDelegate.value.length);
            };
        });

        inputDelegate.onkeyup = function (e) {
            var key = e.target.value[0];

            if (!key) {
                targetCell.innerText = '';
                return;
            }

            if ((key >= 'a' && key <= 'z') || (key >= 'A' && key <= 'Z')) {
                targetCell.innerText = key.toUpperCase();
            }
        }
    }

    render() {
        if (!this.state.puzzleJson) {
            return <div>Loading...</div>;
        } else {
            const entries = this.getBoardEntries(this.state.puzzleJson);
            const board = entries.map((rows, index) => {
                const cells = rows.map((cell, cellIndex) => {
                    return (
                        <div key={cellIndex}
                            data-line={cell.hintNumber}
                            className={cell.className}></div>);
                });
                return <div key={index}>{cells}</div>;
            });
            return (
                <div>
                    <div className="crossword-board">{board}</div>
                    <CrosswordQuestions json={this.state.puzzleJson} />
                </div>);
        }
    }
}

ReactDOM.render(<CrosswordBoard />, root);
