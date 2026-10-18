import random

from fastapi import APIRouter


router = APIRouter(prefix="/ideas", tags=["ideas"])

EVENT_IDEAS = (
    {
        "title": "Sunset picnic in the park",
        "category": "Food & drink",
        "description": "Bring a snack to share and enjoy the golden hour together.",
    },
    {
        "title": "Neighborhood photo walk",
        "category": "Arts & culture",
        "description": "Explore familiar streets and take photos of details you usually miss.",
    },
    {
        "title": "Beginner-friendly board game night",
        "category": "Social",
        "description": "Bring a favorite game or learn something new with the group.",
    },
    {
        "title": "Community morning walk",
        "category": "Sports & outdoors",
        "description": "Take an easy-paced walk together and discover a local trail.",
    },
    {
        "title": "Make-and-take craft hour",
        "category": "Workshop",
        "description": "Try a simple hands-on project and leave with something you made.",
    },
)


@router.get("/random")
def get_random_idea() -> dict[str, str]:
    return random.choice(EVENT_IDEAS)
