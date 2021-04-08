const {Machine, assign, interpret} = require('xstate');

const gameMachine = Machine(
  {
    id: 'game',
    initial: 'playing',
    context: {
      points: 0
    },
    states: {
      playing: {
        on: {
          // Transient transition
          // Will transition to either 'win' or 'lose' immediately upon
          // (re)entering 'playing' state if the condition is met.
          '': [
            { target: 'win', cond: 'didPlayerWin' },
            { target: 'lose', cond: 'didPlayerLose' }
          ],
          // Self-transition
          AWARD_POINTS: {
            actions: assign({
              points: 100
            })
          }
        }
      },
      win: { type: 'final' },
      lose: { type: 'final' }
    }
  },
  {
    guards: {
      didPlayerWin: (context, event) => {
          console.log('winnnnnn');
        // check if player won
        console.log(event);
        return context.points > 99;
      },
      didPlayerLose: (context, event) => {
          console.log('loseeeeee');
          console.log(event);
        // check if player lost
        return context.points < 0;
      }
    }
  }
);

const gameService = interpret(gameMachine)
  .onTransition((state) => console.log(state.value))
  .start();

// Still in 'playing' state because no conditions of
// transient transition were met
// => 'playing'

// When 'AWARD_POINTS' is sent, a self-transition to 'PLAYING' occurs.
// The transient transition to 'win' is taken because the 'didPlayerWin'
// condition is satisfied.
gameService.send('AWARD_POINTS');
// => 'win'