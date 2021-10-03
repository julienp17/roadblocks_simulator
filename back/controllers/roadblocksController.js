const utils = require("../utils/utils")
const conf = require('../configuration/roadblocksConf');

function getRoadblockInfo(modules, roadblockConf) {
    let roadblock = {
        title: roadblockConf.title,
        ongoingCredits: 0,
        creditsNeeded: roadblockConf.creditsNeeded,
        modules: []
    }
    const roadblockModules = modules.filter(module => roadblockConf.modules.includes(module.code))

    for (const module of roadblockModules) {
        const moduleInfo = {
            title: module.title,
            code: module.code,
            isRegistered: module.status !== 'notregistered',
            credits: Number(module.credits)
        }
        if (moduleInfo.isRegistered) {
            roadblock.ongoingCredits += moduleInfo.credits
        }
        roadblock.modules.push(moduleInfo)
    }

    return roadblock
}

async function getRoadblocksModules(auth) {
    const modules = await utils.getAllModules(auth)
    if (modules === null) {
        return null;
    }
    const roadblocksConf = conf[`tek3`]
    const roadblocksModulesCodes = roadblocksConf.innovation.modules.concat(
        roadblocksConf.softSkills.modules,
        roadblocksConf.technicalFoundation.modules,
        roadblocksConf.technicalSupplement.modules,
    )
    let roadblocksModules = modules.filter(module =>
        roadblocksModulesCodes.includes(module.code)
        && module.scolaryear === 2021
    )
    roadblocksModules = roadblocksModules.filter((module, index, self) =>
        index === self.findIndex(otherModule => (
            otherModule.code === module.code
        ))
    )

    return {
        creditsNeeded: roadblocksConf.creditsNeeded,
        roadblocks: [
            getRoadblockInfo(roadblocksModules, roadblocksConf.innovation),
            getRoadblockInfo(roadblocksModules, roadblocksConf.softSkills),
            getRoadblockInfo(roadblocksModules, roadblocksConf.technicalFoundation),
            getRoadblockInfo(roadblocksModules, roadblocksConf.technicalSupplement)
        ]
    }
}

module.exports = {
    getRoadblocksModules(req, res) {
        getRoadblocksModules(req.query)
            .then(infos => {
                if (infos)
                    res.status(200).json(infos);
                else
                    res.status(500).json({message: "failed to load ressources"})
            })
    }
}