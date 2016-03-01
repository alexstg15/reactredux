
export const getTypes = () => {

  const types =  [
      {id: 'none', text: "Select One" },
      {id: 'call', text: 'Call', childs: [
          {id: 'none', text: "Select One" },
          {id: 'returnVoicemail', text: 'Return Voicemail'},
          {id: 'returnEmail', text:'Return Email'},
          {id: 'setAppointment', text:'Set Appointment'},
          {id: 'missingDocs', text:'Missing Docs'},
          {id: 'support', text:'Support'},
          {id: 'pmtPastDue', text:'Pmt Past Due'},
        ]
      },
      {id:'email', text: 'Email', childs: [
          {id: 'none', text: "Select One" },
          {id: 'returnVoicemail', text: 'Return Voicemail'},
          {id: 'returnEmail', text: 'Return Email'},
          {id: 'setAppointment', text: 'Set Appointment'},
          {id: 'missingDocs', text: 'Missing Docs'},
          {id: 'support', text: 'Support'},
        ]
      },
      {id:'Appointment', text: 'Appointment', childs: [
          {id: 'none', text: "Select One" },
          {id: 'inPerson', text: 'In Person'},
          {id: 'phone', text: 'Phone'},
        ]
      },
      {id:'prep', text: 'Prep', childs: [
          {id: 'none', text: "Select One" },
          {id: 'clientAgreement', text: 'Client Agreement'},
          {id: 'enrollmentConversationn', text: 'Erollment Conversation'},
          {id: 'inPersonAppointment', text: 'In Person Appointment'},
          {id: 'phoneAppointment', text: 'Phone Appointment'},
          {id: 'eventConference', text: 'Event/Conference'},
          {id: 'speakingEngagement', text: 'Speaking Engagement'},
        ]
      },
      {id:'clientAgreement', text: 'Client Agreement', childs: [
          {id: 'none', text: "Select One" },
          {id: 'emailOut', text: 'Email Out'},
          {id: 'emailIn', text: 'Email In'},
        ]
      },
      {id:'accounting', text: 'Accounting', childs: [
          {id: 'none', text: "Select One" },
          {id: '1stayment due', text: 'Statement due'},
          {id: 'pastDue', text: 'Past Due', childs: [
            {id: 'none', text: "Select One" },
            {id: '30days', text: '30 days'},
            {id: '60days', text: '60 days'},
            {id: '90days', text: '90 days'},
            {id: '120days', text: '20 days'},
            {id: 'collections', text: 'Collections'},
          ]
        },
        ]
      },
      {id:'accountSetUp', text: 'Account Set Up', childs: [
          {id: 'none', text: "Select One" },
          {id: 'welcomePacketOut', text: 'Welcome packet out'},
        ]
      }
  ]

  return types

}

export const getTypeById = (types, id) => {

  const result = _.reduce(types, (type, res) => ((type.id==id) ? type:res), {})

  return result
}

export const processType = type => {
  const types = getTypes()
  if(!Array.isArray(type)){
    type = []
  }

  if(type.length < 1) {
    type.push(types[0].id)
  }

  if(types[0].id != 'none' && type.length < 2) {
    type.push(getTypeById(types, type[0]).childs[0].id)
  }

  return type
}

