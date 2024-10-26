from validator import ConcernDetails

#TODO
# Returns `polarity` based on the `user_input`
def getPolarity(user_input):
    
    return "Negative"

#TODO
# Returns `concerns_detailed` based on the `user_input`
def getConcerns(user_input):
    concerns_detailed = []
    
    # Get concerns
    concerns = ["feel very low","feel very low "]

    # Finding `category` and `intensity` for each `concern` 
    for concern in concerns:
        category = "Depression"
        intensity = str(9)

        concerns_detailed.append(ConcernDetails(
            concern = concern,
            category = category,
            intensity = intensity
        ))

    return concerns_detailed

#TODO
# Returns timeline shit
def getProgression(results, polarity, concerns_detailed):


    return polarity + concerns_detailed[0].concern