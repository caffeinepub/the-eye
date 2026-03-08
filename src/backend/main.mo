import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Use mixins for storage and authorization
actor {
  type Server = {
    id : Nat;
    name : Text;
    ip : Text;
    tags : [Text];
    category : Text;
    subcategory : Text;
  };

  // Initialize storage and authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  let servers = List.empty<Server>();
  var initialized = false;

  public shared ({ caller }) func initialize() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can initialize");
    };
    if (initialized) { Runtime.trap("Already initialized") };
    let initialServers : [Server] = [
      {
        id = 1;
        name = "OPBlocks Network";
        ip = "buzz.opblocks.com";
        tags = ["Survival", "Skyblock", "Prison"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 2;
        name = "LemonCloud";
        ip = "buzz.lemoncloud.org";
        tags = ["Survival", "PvP", "Skyblock"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 3;
        name = "Complex Gaming";
        ip = "bee.mc-complex.com";
        tags = ["Survival", "Pixelmon", "Cobblemon"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 4;
        name = "BlossomCraft";
        ip = "buzz.blossomcraft.org";
        tags = ["No-grief Survival", "Economy"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 5;
        name = "Netherite";
        ip = "join.netherite.gg";
        tags = ["Lifesteal", "Survival", "Economy"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 6;
        name = "ManaCube";
        ip = "buzz.manacube.com";
        tags = ["Parkour", "Survival", "RPG"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 7;
        name = "WildWood SMP";
        ip = "join.wildwoodsmp.com";
        tags = ["Lifesteal SMP"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 8;
        name = "Craftadia";
        ip = "bee.craftadia.com";
        tags = ["Survival", "Protected"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 9;
        name = "Pixelblock";
        ip = "buzz.pixelblockmc.com";
        tags = ["Survival", "OneBlock"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 10;
        name = "PikaNetwork";
        ip = "buzz.pika.host";
        tags = ["Survival", "Skyblock"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 11;
        name = "JartexNetwork";
        ip = "buzzu.jartex.fun";
        tags = ["Cracked", "Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 12;
        name = "Minewind";
        ip = "buzz.minewind.net";
        tags = ["RPG", "Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 13;
        name = "EnchantedMC";
        ip = "buzz.enchantedmc.net";
        tags = ["Skyblock", "Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 14;
        name = "BananaSMP";
        ip = "play.bananasmp.net";
        tags = ["Lifesteal", "BoxPvP"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 15;
        name = "CosmosMC";
        ip = "buzz.cosmosmc.org";
        tags = ["Earth", "Survival", "Factions"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 16;
        name = "Twerion";
        ip = "buzz.twerion.net";
        tags = ["BedWars", "Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 17;
        name = "MysticMC";
        ip = "buzz.mysticmc.co";
        tags = ["No-grief Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 18;
        name = "Voidsent MC";
        ip = "play.voidsent.net";
        tags = ["SMP", "Custom Enchants"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 19;
        name = "CozySMP";
        ip = "buzz.cozysmp.com";
        tags = ["Laid-back Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 20;
        name = "Vanilla Europa";
        ip = "buzz.vanillaeuropa.com";
        tags = ["Semi-Vanilla SMP"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 21;
        name = "MellowCraft";
        ip = "buzz.mellowcraft.org";
        tags = ["Semi-Vanilla"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 22;
        name = "PlayFuse";
        ip = "pog.PlayFuse.net";
        tags = ["Survival", "Skyblock", "Bedrock"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 23;
        name = "KurdoSMP";
        ip = "kurdosmp.xyz:25605";
        tags = ["Survival", "Economy"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 24;
        name = "Questal";
        ip = "play.questal.eu:9859";
        tags = ["Survival", "Dungeons"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 25;
        name = "MinePlay";
        ip = "213.32.6.81";
        tags = ["Survival", "Economy"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 26;
        name = "VinxSMP";
        ip = "vinxsmp.falixsrv.me";
        tags = ["Vanilla Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 27;
        name = "LibertyMC";
        ip = "play.libertymc.net:25599";
        tags = ["Survival", "Non-P2W"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 28;
        name = "RiverCraft";
        ip = "play.rivercraft.net";
        tags = ["Survival", "Economy"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 29;
        name = "VentureSMP";
        ip = "play.venturesmp.com";
        tags = ["Community Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 30;
        name = "EliteSurvival";
        ip = "play.elitesurvival.net";
        tags = ["Hardcore Survival"];
        category = "crossplay";
        subcategory = "";
      },
      {
        id = 31;
        name = "RyzenMC";
        ip = "eu.ryzenmc.net";
        tags = ["PvP Practice"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 32;
        name = "Blocksmc";
        ip = "blocksmc.com";
        tags = ["PvP", "BedWars", "SkyWars"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 33;
        name = "BoxPvP";
        ip = "play.boxpvp.net";
        tags = ["BoxPvP", "Crystal"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 34;
        name = "LifeSteal SMP";
        ip = "buzz.lifestealsmp.com";
        tags = ["Hardcore Lifesteal"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 35;
        name = "UniversalMC";
        ip = "universalmc.fun";
        tags = ["Lifesteal", "Practice"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 36;
        name = "NoSleepWars";
        ip = "NoSleepWars.exaroton.me";
        tags = ["PvP", "BedWars"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 37;
        name = "InfestedLands";
        ip = "infestedlands.mineplay.pro:25248";
        tags = ["KitPvP"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 38;
        name = "Minestatio";
        ip = "mc.minestat.io:25599";
        tags = ["RandomKit PvP"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 39;
        name = "BELAIR";
        ip = "belairmc.eu";
        tags = ["EU PvP", "Custom Enchants"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 40;
        name = "TalonMC";
        ip = "play.talonmc.net";
        tags = ["Skyblock", "Survival PvP"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 41;
        name = "Riot Network";
        ip = "riot-network.ga";
        tags = ["PvP"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 42;
        name = "PVP Hub";
        ip = "mc.pvp-hub.com:25544";
        tags = ["Minigames"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 43;
        name = "2b2t";
        ip = "2b2t.org";
        tags = ["Anarchy", "PvP"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 44;
        name = "Mythria";
        ip = "play.mythria.gg";
        tags = ["Survival RPG", "PvP"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 45;
        name = "BattleForge";
        ip = "play.battleforge.net";
        tags = ["Factions", "War"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 46;
        name = "Revenant Lifesteal";
        ip = "185.228.82.6:25943";
        tags = ["Hardcore"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 47;
        name = "BorderChaos";
        ip = "157.85.95.62:27281";
        tags = ["Anarchy"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 48;
        name = "NightVanilla";
        ip = "NightVanilla.net";
        tags = ["Crystal PvP"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 49;
        name = "KitsPvP";
        ip = "play.kitspvp.net";
        tags = ["Practice"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 50;
        name = "CrystalWars";
        ip = "play.crystalwars.net";
        tags = ["Crystal PvP"];
        category = "pvp";
        subcategory = "";
      },
      {
        id = 51;
        name = "play.skykingdoms.net";
        ip = "mc.melonsmp.fun";
        tags = [];
        category = "additional";
        subcategory = "survival";
      },
      {
        id = 52;
        name = "play.vanillaplus.net";
        ip = "play.craftrise.tr";
        tags = [];
        category = "additional";
        subcategory = "survival";
      },
      {
        id = 53;
        name = "play.anubismc.com";
        ip = "play.theearth.net";
        tags = [];
        category = "additional";
        subcategory = "survival";
      },
      {
        id = 54;
        name = "play.survivaluniverse.com";
        ip = "play.eternalsmp.com";
        tags = [];
        category = "additional";
        subcategory = "survival";
      },
      {
        id = 55;
        name = "play.chillmc.net";
        ip = "play.purevanilla.net";
        tags = [];
        category = "additional";
        subcategory = "survival";
      },
      {
        id = 56;
        name = "play.pvplegacy.net";
        ip = "play.mccentral.org";
        tags = [];
        category = "additional";
        subcategory = "pvp_minigames";
      },
      {
        id = 57;
        name = "play.hypixel.net";
        ip = "play.mineplex.com";
        tags = [];
        category = "additional";
        subcategory = "pvp_minigames";
      },
      {
        id = 58;
        name = "play.ultrapvp.net";
        ip = "play.pvpworld.net";
        tags = [];
        category = "additional";
        subcategory = "pvp_minigames";
      },
      {
        id = 59;
        name = "play.crystalpvp.net";
        ip = "play.boxpvp.co";
        tags = [];
        category = "additional";
        subcategory = "pvp_minigames";
      },
      {
        id = 60;
        name = "play.arenapvp.net";
        ip = "play.kitpvp.co";
        tags = [];
        category = "additional";
        subcategory = "pvp_minigames";
      },
      {
        id = 61;
        name = "bedrock.opblocks.com";
        ip = "bedrock.lemoncloud.org";
        tags = [];
        category = "additional";
        subcategory = "crossplay_additional";
      },
      {
        id = 62;
        name = "bedrock.manacube.com";
        ip = "play.infinitymc.org";
        tags = [];
        category = "additional";
        subcategory = "crossplay_additional";
      },
      {
        id = 63;
        name = "play.skyblock.net";
        ip = "play.prison.net";
        tags = [];
        category = "additional";
        subcategory = "crossplay_additional";
      },
      {
        id = 64;
        name = "play.factions.org";
        ip = "play.creative.net";
        tags = [];
        category = "additional";
        subcategory = "crossplay_additional";
      },
      {
        id = 65;
        name = "play.minigames.net";
        ip = "play.survival.net";
        tags = [];
        category = "additional";
        subcategory = "crossplay_additional";
      },
    ];

    servers.addAll(initialServers.values());
    initialized := true;
  };

  public query ({ caller }) func getAllServers() : async [Server] {
    servers.toArray();
  };

  public query ({ caller }) func getServersByCategory(category : Text) : async [Server] {
    servers.filter(func(s) { s.category == category }).toArray();
  };

  func containsTag(tags : [Text], searchTag : Text) : Bool {
    tags.any(func(tag) { tag.toLower().contains(#text searchTag) });
  };

  public query ({ caller }) func searchServers(searchText : Text) : async [Server] {
    let lowerSearch = searchText.toLower();
    let results = servers.filter(
      func(s) {
        s.name.toLower().contains(#text lowerSearch) or containsTag(s.tags, lowerSearch);
      }
    );
    results.toArray();
  };
};
