export const hero_db: Array<string> = [
  "Fighter;c;3;3;:Experience needed to level up the fighter never increase.",
  "Looter;c;2;1;Last hit:Gain [LEVEL] gold.",
  "Loyal Companion;c;1;1;Knocked out:Give each other hero +[LEVEL] temporary attack and health.",
  "Mule;c;1;2;Level up:Double the mule's health.;Dismiss:For each 8 health the mule has, give each other hero 1 health.",
  "Squire;c;2;2;Dismiss:Give [LEVEL] random hero[PLURAL¨¨es] +[LEVEL] attack.",
  "Scholar;c;2;1;Start of battle:Gain +[LEVEL] attack.",
  "Armorer;c;1;3;Start of battle:Give each other hero +[LEVEL*2] temporary health.",
  "Archer;c;3;1;Start of battle:+[LEVEL] first strike.",
  "Rat;c;1;1;Start of battle:Summon a [ATTACK]/[HEALTH/2] Feral Rat with poisonous in front of the Rat.",
  "Pet Sitter;c;0;2;:Whenever a hero is summoned, it gains +[LEVEL] attack and health.",
  "Trader;u;0;1;End of battle:Gain [LEVEL] gold. Gain [LEVEL] additional gold if the trader survives.",
  "Druid;u;1;3;Start of battle:Give hero[PLURAL¨¨es] [LEVEL] space[PLURAL¨¨s] to the right +[LEVEL] temporary attack and health. Bonuses become permanent on animals.",
  "Innkeeper;u;3;3;:+[LEVEL*2]% chance of an additional hero in the tavern.;Refresh tavern:Randomly gain either +[LEVEL] attack or health.",
  "Lone wolf;u;2;4;:Whenever a hero is dismissed, the lone wolf gains attack and health equal to [LEVEL*25]% of the dismissed hero's stats.",
  "Summoner;u;1;5;:Immediately deal [LEVEL] damage to [LEVEL] random monster whenever a hero is summoned.",
  "Spider egg;u;0;1;Knocked out:Summon [LEVEL] 1/1 Spiderling[PLURAL¨¨s] with poisonous.",
  "Berserker;u;1;5;:Whenever the berserker takes damage it gains +[LEVEL] attack.",
  "Cat;u;1;1;:Lifesteal.",
  "Necromancer;u;2;2;:When a non-undead hero is knocked out in front of the necromancer, summon a X/1 Risen Skeleton in front of the necromancer, where X is [LEVEL/3]% of the knocked out hero's attack.",
  "Bard;u;2;2;Start of battle:Give each hero a random buff. +[LEVEL] temporary attack or health, poisonous, +[LEVEL] shield, or +[LEVEL] first strike."
];
export const summons_db: Array<string> = [
  "Feral Rat;s;0;0;Poisonous.",
  "Spiderling;s;1;1;Poisonous.",
  "Risen Skeleton;s;0;1"
];
