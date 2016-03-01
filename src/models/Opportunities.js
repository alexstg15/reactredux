export const getFors = () => {
	const fors = [
		{id: 'none', text: 'Select One'},
		{id: 'universalLeadership', text: 'Universal Leadership'},
		{id: 'infiniteBeginnings', text: 'Infinite Beginnings'},
	]
	return fors
}

export const getStages = () => {
	const stages = [
		{id: 'none', text: 'Select One'},
		{id: 'newLead', text: 'New Lead'},
		{id: 'won', text: 'Won'},
		{id: 'lost', text: 'Lost'},
	]
	return stages
}

export const getTypes = () => {
	const types = [
		{id: 'none', text: 'Select One'},
		{id: 'client', text: 'Client'},
		{id: 'referalPartner', text: 'Referal Partner'},
		{id: 'affiliate', text: 'Affiliate'},
		{id: 'speakingEngagement', text: 'Speaking Engagement'},
		{id: 'sponsorship', text: 'Sponsorship'},
		{id: 'venuePartner', text: 'Venue Partner'},
	]
	return types
}

export const getStageById = (stages, id) => _.reduce(stages, (stage, res) => ((stage.id==id) ? stage:res), {})

export const getStageTextById = (id) => {
	const stages = getStages()
	const stage = getStageById(stage, id)
	return (stage) ? stage.text : ''
}

export const getTypeById = (types, id) => _.reduce(types, (type, res) => ((type.id==id) ? type:res), {})



