import {CST} from '../util/CST';
import Image = Phaser.GameObjects.Image;

import {Skill} from './Skill';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto';
import {ImageHud} from './ImageHud';

export class CharacterSprite extends Phaser.Physics.Arcade.Sprite implements IAction {
  currentHp: number;
  maxHp: number;
  currentEnergy: number;
  maxEnergy: number;
  attack: number;
  armor: number;
  magic: number;
  magicResistance: number;
  speed: number;
  attackSpeed: number;
  healthRegen: number;
  energyRegen: number;
  critical: number;
  reloadSkill: number;
  attackDistance: number;
  level: number;
  avatar: ImageHud;
  avatarMap: ImageHud;
  animKey = CST.ANIM.CHARACTER;
  champion: any;
  // Skill
  skillQ: Skill;
  skillW: Skill;
  skillE: Skill;
  skillR: Skill;
  scene: Phaser.Scene;
  keys!: { [index: string]: Phaser.Input.Keyboard.Key };
  moveTo: MoveTo;
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, key?: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.setDepth(2);
    scene.physics.world.enableBody(this);
    this.setCollideWorldBounds(true);
    this.setImmovable(true);
    this.setOrigin(0, 0);
    this.body.setSize(this.width - 50, this.height - 20, true).setOffset(25, 25);
    this.champion = CST.ATLAS.CHARACTER[key];
    // SET PROPERTY
    const properties = this.champion.PROPERTY;
    this.maxHp = properties.HP;
    this.currentHp = this.maxHp;
    this.maxEnergy = properties.ENERGY;
    this.currentEnergy = this.maxEnergy;
    this.attack = properties.ATTACK;
    this.armor = properties.ARMOR;
    this.magic = properties.MAGIC;
    this.magicResistance = properties.MAGICAL_RESISTENCE;
    this.speed = properties.SPEED;
    this.attackSpeed = properties.ATTACK_SPEED;
    this.healthRegen = properties.HEALTH_REGEN;
    this.energyRegen = properties.ENERGY_REGEN;
    this.critical = properties.CRITICAL;
    this.reloadSkill = properties.RELOAD_SKILL;
    this.attackDistance = properties.ATTACK_DISTANCE;
    this.level = 1;
    this.avatar = new ImageHud(scene, 0, 0, this.champion.AVATAR, false);
    this.avatarMap = new ImageHud(scene, 0, 0, this.champion.AVATAR, false);
    this.scene = scene;

    const skillInformation = this.champion.SKILL;
    this.skillQ = new Skill(scene, this.body.x, this.body.y,
      skillInformation.Q.TEXTURE,
      skillInformation.Q.FRAME,
      skillInformation.Q.NAME,
      skillInformation.Q.DESCRIPTION,
      skillInformation.Q.TIME_LOAD,
      skillInformation.Q.ENERGY,
      skillInformation.Q.ACTION,
      skillInformation.Q.DISTANCE,
      new Image(scene, 100, 100, skillInformation.Q.IMAGE.TEXTURE, skillInformation.Q.IMAGE.FRAME)
    );

    this.skillW = new Skill(scene, this.body.x, this.body.y,
      skillInformation.W.TEXTURE,
      skillInformation.W.FRAME,
      skillInformation.W.NAME,
      skillInformation.W.DESCRIPTION,
      skillInformation.W.TIME_LOAD,
      skillInformation.W.ENERGY,
      skillInformation.W.ACTION,
      skillInformation.W.DISTANCE,
      new Image(scene, 100, 100, skillInformation.W.IMAGE.TEXTURE, skillInformation.W.IMAGE.FRAME)
    );

    this.skillE = new Skill(scene, this.body.x, this.body.y,
      skillInformation.E.TEXTURE,
      skillInformation.E.FRAME,
      skillInformation.E.NAME,
      skillInformation.E.DESCRIPTION,
      skillInformation.E.TIME_LOAD,
      skillInformation.E.ENERGY,
      skillInformation.E.ACTION,
      skillInformation.E.DISTANCE,
      new Image(scene, 100, 100, skillInformation.E.IMAGE.TEXTURE, skillInformation.E.IMAGE.FRAME),
      null,
      skillInformation.E.STACK
    );

    this.skillR = new Skill(scene, this.body.x, this.body.y,
      skillInformation.R.TEXTURE,
      skillInformation.R.FRAME,
      skillInformation.R.NAME,
      skillInformation.R.DESCRIPTION,
      skillInformation.R.TIME_LOAD,
      skillInformation.R.ENERGY,
      skillInformation.R.ACTION,
      skillInformation.R.DISTANCE,
      new Image(scene, 100, 100, skillInformation.R.IMAGE.TEXTURE, skillInformation.R.IMAGE.FRAME),
    );
    this.scene.add.existing(this);
    // @ts-ignore
    this.keys = this.scene.input.keyboard.addKeys('Q, W, E, R, F1');
  }

  use_q(x: number, y: number): void {
    this.skillQ.handler(x, y);
  }

  use_w(): void {
    throw new Error('Method not implemented.');
  }

  use_e(): void {
    throw new Error('Method not implemented.');
  }

  use_r(): void {
    throw new Error('Method not implemented.');
  }

  base(): void {
    throw new Error('Method not implemented.');
  }

  minusHealth(amount: number): void {
    if (amount < 0) {
      amount = 0;
    }
    this.currentHp = this.currentHp - amount;
    if (this.currentHp < 0) {
      this.death();
    }
  }

  plusHealth(amount: number): void {
    const healthTemp = this.currentHp + amount;
    if (healthTemp > this.maxHp) {
      this.currentHp = this.maxHp;
    } else {
      this.currentHp = healthTemp;
    }
  }

  attack_normal(objTarget: CharacterSprite) {
    objTarget.minusHealth(this.attack - objTarget.armor);
  }

  death() {
    this.play(this.animKey.HURT, true);
    this.destroy();
  }

  getAvatar(): ImageHud {
    return this.avatar;
  }
  protected preUpdate(time: number, delta: number): void {
  }
}
