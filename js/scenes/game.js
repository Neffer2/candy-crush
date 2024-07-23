let candies = [];
let candy;

export class Game extends Phaser.Scene {
    constructor ()
    {
        super('Game');
    }

    create (){
        for (let i = 0; i < 5; i++) {
            candies.push(
                candy = this.add.sprite(candy.x + 100, 100, 'candy' + (i + 1))
                .setScale(.3)
                .setInteractive()
            );
        }
    } 

    update(){
        
    }
}
