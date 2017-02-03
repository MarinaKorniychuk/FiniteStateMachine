class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        this._config = config;
        this._currentState = this._config.initial;
        this._stackStates = new Array();
        this._stackStates.push(this._config.initial);
        this._undoStates = new Array();
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this._currentState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        if (state in this._config.states) {
        this._currentState = state;
        this._stackStates.push(this._currentState);
        while (this._undoStates.length > 0) {
            this._undoStates.pop();
            }
        }
        else {
            throw new Exception("State isn't exist.");
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        if (event in this._config.states[this._currentState].transitions) {
            this._currentState = this._config.states[this._currentState].transitions[event];
            this._stackStates.push(this._currentState);
            while (this._undoStates.length > 0) {
            this._undoStates.pop();
            }
        }
        else {
            throw new Exception("Event isn't in current state.");
        }
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this._currentState = this._config.initial;
        while (this._stackStates.length > 1) {
            this._stackStates.pop();
        }
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        if (event) {
            let resultArray = new Array();
            for (let state in this._config.states) {
                if (this._config.states[state].transitions[event]) {
                    resultArray.push(state);
                }
            }
            return resultArray;
        }
        else {
            return Object.keys(this._config.states);
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this._stackStates.length == 1) {
            return false;
        }
        this._undoStates.push(this._stackStates.pop());
        this._currentState = this._stackStates.pop();
        this._stackStates.push(this._currentState);
        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (this._undoStates.length == 0) {
            return false;
        }
        this._currentState = this._undoStates.pop();
        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this._currentState = this._config.initial;
        while (this._stackStates.length > 1) {
            this._stackStates.pop();
        }
        while (this._undoStates.length > 0) {
            this._undoStates.pop();
        }
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
