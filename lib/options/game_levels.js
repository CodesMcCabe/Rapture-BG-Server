const gameLevelAttributes = {
    zero: {
        bossName: "Worm",
        bossHp: 100,
        bossSpeed: 100,
        explosion: false,
        children: false,
    },

    one: {
        bossName: "Worm",
        bossHp: 100,
        bossSpeed: 100,
        explosion: true,
        children: false,
    },

    two: {
        bossName: "Worm",
        bossHp: 100,
        bossSpeed: 100,
        explosion: true,
        children: true,
    },
};

const gameLevels = [
    gameLevelAttributes.zero,
    gameLevelAttributes.one
];

module.exports = gameLevels;
