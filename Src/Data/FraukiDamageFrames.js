var fraukiDamageFrames = {
	
	//slash across in front of yourself
	'Attack Front0002': {
		x: 0, y: 10, w: 65, h: 34,
		damage: 1,
		knockback: 1,
		priority: 1,
		juggle: 0
	},
	
	//followthrough of the front slash, is behind you
	'Attack Front0003': {
		x: -35, y: 0, w: 35, h: 15,
		damage: 1,
		knockback: 0.1,
		priority: 1,
		juggle: 0
	},

	//slash across in front of yourself return
	'Attack Front0004': {
		x: 40, y: 10, w: 35, h: 35,
		damage: 1,
		knockback: 0.3,
		priority: 1,
		juggle: 0
	},

	//return to the followthrough, smaller and weaker
	'Attack Front0005': {
		x: -30, y: 0, w: 25, h: 15,
		damage: 1,
		knockback: 0.1,
		priority: 1,
		juggle: 0
	},
	
	'Attack Overhead0002': {
		x: -15, y: 15, w: 15, h: 15,
		damage: 1,
		knockback: 0,
		priority: 2,
		juggle: 0
	},

	//overhead swing
	'Attack Overhead0003': {
		x: -15, y: 15, w: 25, h: 30,
		damage: 1,
		knockback: 0.1,
		priority: 2,
		juggle: 0.1
	},

	//overhead swing
	'Attack Overhead0004': {
		x: 15, y: 10, w: 15, h: 15,
		damage: 1,
		knockback: 0.1,
		priority: 2,
		juggle: 0.2
	},

	//overhead swing
	'Attack Overhead0005': {
		x: -30, y: -15, w: 45, h: 30,
		damage: 2,
		knockback: 0.1,
		priority: 2,
		juggle: 0.5
	},

	//overhead swing
	'Attack Overhead0006': {
		x: -30, y: -28, w: 75, h: 60,
		damage: 2.5,
		knockback: 0,
		priority: 2,
		juggle: 1
	},

	//overhead swing
	'Attack Overhead0007': {
		x: -30, y: -28, w: 75, h: 60,
		damage: 2,
		knockback: 0,
		priority: 2,
		juggle: 1
	},
	
	//stab, big short initial shape
	'Attack Stab0004': {
		x: -25, y: 0, w: 50, h: 40,
		damage: 3,
		knockback: 1.4,
		priority: 2,
		juggle: 0
	},

	//stab, long followthrough
	'Attack Stab0005': {
		x: 0, y: 15, w: 83, h: 10,
		damage: 2,
		knockback: 1,
		priority: 2,
		juggle: 0
	},
	
	//stab, long followthrough
	'Attack Stab0006': {
		x: 0, y: 15, w: 83, h: 12,
		damage: 2,
		knockback: 0.8,
		priority: 2,
		juggle: 0
	},

	//stab, long followthrough
	'Attack Stab0007': {
		x: 0, y: 15, w: 83, h: 12,
		damage: 2,
		knockback: 0.8,
		priority: 2,
		juggle: 0
	},

	//stab, long followthrough
	'Attack Stab0008': {
		x: 0, y: 15, w: 83, h: 12,
		damage: 1,
		knockback: 0.4,
		priority: 2,
		juggle: 0
	},

	//stab taper off
	'Attack Stab0009': {
		x: 0, y: 15, w: 83, h: 12,
		damage: 1,
		knockback: 0,
		priority: 1,
		juggle: 0
	},

	//stab, taper off
	'Attack Stab0010': {
		x: 0, y: 15, w: 83, h: 12,
		damage: 1,
		knockback: 0,
		priority: 1,
		juggle: 0
	},

	'Attack Dive0010': {
		x: -10, y: -5, w: 28, h: 45,
		damage: 4,
		knockback: 2,
		priority: 3,
		juggle: -1
	},

	'Attack Dive0011': {
		x: -10, y: 15, w: 28, h: 50,
		damage: 3,
		knockback: 2,
		priority: 3,
		juggle: -1
	},

	'Attack Dive0012': {
		x: -2, y: 40, w: 13, h: 33,
		damage: 2.5,
		knockback: 1.5,
		priority: 3,
		juggle: -1
	},

	'Attack Dive0013': {
		x: -2, y: 40, w: 13, h: 33,
		damage: 2.5,
		knockback: 1.5,
		priority: 3,
		juggle: -1
	},

	'Attack Dive0014': {
		x: -2, y: 40, w: 13, h: 33,
		damage: 2.5,
		knockback: 1.5,
		priority: 3,
		juggle: -1
	},

	'Attack Dive0015': {
		x: -2, y: 40, w: 13, h: 33,
		damage: 2.5,
		knockback: 1.5,
		priority: 3,
		juggle: -1
	},

	'Attack Dive0016': {
		x: -2, y: 40, w: 13, h: 33,
		damage: 2.5,
		knockback: 1.5,
		priority: 3,
		juggle: -1
	},

	'Attack Dive0017': {
		x: -2, y: 40, w: 13, h: 33,
		damage: 2.5,
		knockback: 1.5,
		priority: 3,
		juggle: -1
	},

	'Attack Dive0018': {
		x: -30, y: -8, w: 70, h: 55,
		damage: 3,
		knockback: 1.75,
		priority: 2,
		juggle: -1
	}

};

var fraukiAnimations = [
	{ Name: 'stand', Frames:  ['Stand0000'],  Fps: 10 , Loop: true },
	{ Name: 'run', Frames:  ['Run0000', 'Run0001', 'Run0002', 'Run0003', 'Run0004', 'Run0005', 'Run0006', 'Run0007'],  Fps: 13 , Loop: true },
	{ Name: 'jump', Frames:  ['Jump0000', 'Jump0001', 'Jump0002', 'Jump0003', 'Jump0004'],  Fps: 10 , Loop: true },
	{ Name: 'peak', Frames:  ['Peak0000', 'Peak0001'],  Fps: 14 , Loop: false },
	{ Name: 'fall', Frames:  ['Fall0000', 'Fall0001', 'Fall0002', 'Fall0003'],  Fps: 18 , Loop: true },
	{ Name: 'land', Frames:  ['Land0000', 'Land0001', 'Land0002'],  Fps: 10 , Loop: false },
	{ Name: 'crouch', Frames:  ['Crouch0000', 'Crouch0001', 'Crouch0002', 'Crouch0003', 'Crouch0004', 'Crouch0005', 'Crouch0006', 'Crouch0007', 'Crouch0008'],  Fps: 20 , Loop: false },
	{ Name: 'flip', Frames:  ['Flip0000', 'Flip0001', 'Flip0002', 'Flip0003', 'Flip0004'],  Fps: 14 , Loop: false },
	{ Name: 'roll', Frames:  ['Roll0000', 'Roll0001', 'Roll0002', 'Roll0003', 'Roll0004', 'Roll0005', 'Roll0013'],  Fps: 14 , Loop: false },
	{ Name: 'hit', Frames:  ['Hit0000', 'Hit0001'],  Fps: 10 , Loop: true },
	{ Name: 'kick', Frames:  ['Kick0000', 'Kick0001'],  Fps: 18 , Loop: false },
	{ Name: 'roll_jump', Frames:  ['Roll0009', 'Roll0010', 'Roll0011', 'Roll0012'],  Fps: 18 , Loop: false },
	{ Name: 'materialize', Frames:  ['Materialize0000', 'Materialize0001', 'Materialize0002', 'Materialize0003', 'Materialize0004', 'Materialize0005', 'Materialize0006', 'Materialize0007', 'Materialize0008', 'Materialize0009', 'Materialize0010'],  Fps: 18 , Loop: false },

	{ Name: 'attack_front', Frames:  ['Attack Front0001', 'Attack Front0002', 'Attack Front0003', 'Attack Front0004', 'Attack Front0005', 'Attack Front0006', 'Attack Front0007', 'Attack Front0007', 'Attack Front0008', 'Attack Front0009'], Fps: 16, Loop: false },
	{ Name: 'attack_overhead', Frames:  ['Attack Overhead0000', 'Attack Overhead0001', 'Attack Overhead0002', 'Attack Overhead0003', 'Attack Overhead0004', 'Attack Overhead0005', 'Attack Overhead0006', 'Attack Overhead0007', 'Attack Overhead0008', 'Attack Overhead0009', 'Attack Overhead0010', 'Attack Overhead0011', 'Attack Overhead0011'], Fps: 14, Loop: false },
	{ Name: 'attack_stab', Frames:  ['Attack Stab0000', 'Attack Stab0000', 'Attack Stab0001', 'Attack Stab0001', 'Attack Stab0002', 'Attack Stab0003', 'Attack Stab0004', 'Attack Stab0005', 'Attack Stab0006', 'Attack Stab0007', 'Attack Stab0008', 'Attack Stab0009', 'Attack Stab0010', 'Attack Stab0011', 'Attack Stab0012', 'Attack Stab0012', 'Attack Stab0013', 'Attack Stab0013', 'Attack Stab0014', 'Attack Stab0015',  'Attack Stab0016', 'Attack Stab0017'], Fps: 20 , Loop: false },
	{ Name: 'attack_dive_charge', Frames:  ['Attack Dive0000', 'Attack Dive0001', 'Attack Dive0002', 'Attack Dive0003', 'Attack Dive0004', 'Attack Dive0005', 'Attack Dive0009', 'Attack Dive0010', 'Attack Dive0011'], Fps: 20 , Loop: false },
	{ Name: 'attack_dive_fall', Frames:  ['Attack Dive0012', 'Attack Dive0013', 'Attack Dive0014', 'Attack Dive0015', 'Attack Dive0016', 'Attack Dive0017'], Fps: 20 , Loop: true },
	{ Name: 'attack_dive_land', Frames:  ['Attack Dive0018', 'Attack Dive0019', 'Attack Dive0020', 'Attack Dive0021', 'Attack Dive0022', 'Attack Dive0023', 'Attack Dive0024', 'Attack Dive0025', 'Attack Dive0026', 'Attack Dive0027', 'Attack Dive0028'], Fps: 20 , Loop: false }
];