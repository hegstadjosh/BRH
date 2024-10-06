import json
import os
from typing import Dict, List, Any
from dotenv import load_dotenv
from openai import OpenAI
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key="")

# Example knowledge base json structure
knowledge_base_example = {
    "knowledge_base": {
        "title": "BrainButler Knowledge Base",
        "pages": [
            {
                "page_id": "001",
                "title": "Summary",
                "description": "Overview of BrainButler's features and capabilities."
            },
            {
                "page_id": "002",
                "title": "System Architecture",
                "description": "Details on input methods, information processing flow, and AI crews."
            },
            {
                "page_id": "003",
                "title": "Features",
                "description": "List of features including user-controlled page generation and feedback options."
            },
            {
                "page_id": "004",
                "title": "User Interface",
                "description": "Information on the Chrome extension and web app functionalities."
            },
            {
                "page_id": "005",
                "title": "Data Storage",
                "description": "Explanation of how user data, pages, and metadata are stored."
            }
        ]
    }
}

#knowledge base modification functions
def add_page(knowledge_base: Dict[str, Any], page: Dict[str, Any]) -> Dict[str, Any]:
    knowledge_base["pages"].append(page)
    return knowledge_base

# Function definitions
def set_openai_api_key(api_key):
    client.api_key = api_key

def create_agent_prompt(role, goal, backstory):
    return f"You are a {role}. Your goal is to {goal}. Backstory: {backstory}"

def get_response(prompt):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "generate info from users' notes:"},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content

def execute_task(agent_prompt, task_description, context=""):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": agent_prompt},
            {"role": "user", "content": f"Task: {task_description}\nContext: {context}"}
        ]
    )

    return response.choices[0].message.content
    # return response.choices[0].message['content']

def analyze_kb(knowledge_base):
    agent_prompt = create_agent_prompt(
        "Knowledge Base Organizer",
        "Organize and manage knowledge bases",
        "An expert in information architecture with a keen eye for organizing complex data structures."
    )
    task = "Analyze the current knowledge base structure and suggest improvements or new knowledge bases."
    return execute_task(agent_prompt, task, str(knowledge_base))

def summarize_kb(knowledge_base):
    agent_prompt = create_agent_prompt(
        "Knowledge Base Summarizer",
        "Summarize the current knowledge base as concisely as possible",
        "An expert in summarizing and condensing information into concise and clear summaries."
    )
    task = "Provide a summary of the current knowledge base."
    return execute_task(agent_prompt, task, str(knowledge_base))

# def assimilation(new_info, kb_analysis):
#     agent_prompt = create_agent_prompt(
#         "Information Assimilator",
#         "Decide how to incorporate new information into existing knowledge bases",
#         "A skilled analyst with expertise in content curation and information synthesis."
#     )
#     task = ("Review new information and determine the best way to incorporate it into the existing knowledge base.")
#     context = f"New Information: {new_info}\nKnowledge Base Analysis: {kb_analysis}"
#     return execute_task(agent_prompt, task, context)

def assimilation(new_info, knowledge_base):
    agent_prompt = create_agent_prompt(
        "Information Assimilator and Summarizer",
        "Analyze the knowledge base, summarize it, and decide how to incorporate new information",
        "A skilled analyst with expertise in content curation, information synthesis, and knowledge base management."
    )
    
    task = ("Analyze the given knowledge base, determine if there's a relevant page for the new information, "
            "and decide how to incorporate it. If a relevant page exists, provide its details and suggestions "
            "for augmentation. If not, provide a plan for creating a new page.")
    
    context = f"New Information: {new_info}\nKnowledge Base: {json.dumps(knowledge_base, indent=2)}"
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": agent_prompt},
            {"role": "user", "content": f"Task: {task}\nContext: {context}"}
        ],
        functions=[
            {
                "name": "process_knowledge_base",
                "description": "Process the knowledge base and new information",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "summary": {
                            "type": "string",
                            "description": "A brief summary of the current knowledge base"
                        },
                        "relevant_page": {
                            "type": "object",
                            "properties": {
                                "exists": {"type": "boolean"},
                                "page_id": {"type": "string"},
                                "title": {"type": "string"},
                                "content": {"type": "string"}
                            },
                            "required": ["exists"]
                        },
                        "action_plan": {
                            "type": "string",
                            "description": "Plan for incorporating the new information"
                        }
                    },
                    "required": ["summary", "relevant_page", "action_plan"]
                }
            }
        ],
        function_call={"name": "process_knowledge_base"}
    )

    return json.loads(response.choices[0].message.function_call.arguments)

def creation(assimilation_plan):
    agent_prompt = create_agent_prompt(
        "Content Creator",
        ("Research and generate comprehensive pages for knowledge bases"),
        ("A creative writer and researcher with a talent for producing engaging and informative content.")
    )
    task = ("Research and generate a new page for the knowledge base based on the assimilation plan.")
    return execute_task(agent_prompt, task, assimilation_plan)

# def process_new_information(new_info, knowledge_base):
#     # Step 1: Analyze knowledge base structure
#     kb_summary = summarize_kb(knowledge_base)
    
#     # Step 2: Determine how to incorporate new information
#     assimilation_plan = assimilation(new_info, kb_summary)
    
#     # Step 3: Create new content based on the assimilation plan
#     new_content = creation(assimilation_plan)
    
#     return new_content

def process_new_information(new_info, knowledge_base):
    # Step 1: Analyze knowledge base and determine how to incorporate new information
    assimilation_result = assimilation(new_info, knowledge_base)
    
    # Step 2: Create new content based on the assimilation result
    if assimilation_result['relevant_page']['exists']:
        creation_prompt = (f"Augment the existing page '{assimilation_result['relevant_page']['title']}' "
                           f"with the following new information: {new_info}\n"
                           f"Existing content: {assimilation_result['relevant_page']['content']}\n"
                           f"Action plan: {assimilation_result['action_plan']}")
    else:
        creation_prompt = (f"Create a new page with the following information: {new_info}\n"
                           f"Action plan: {assimilation_result['action_plan']}")
    
    new_content = creation(creation_prompt)
    
    return {
        "summary": assimilation_result['summary'],
        "action_taken": "augmented" if assimilation_result['relevant_page']['exists'] else "created",
        "page_id": assimilation_result['relevant_page'].get('page_id', "new"),
        "new_content": new_content
    }

#flask server
@app.route('/get-response', methods=['POST'])
def api_get_response():
    data = request.json
    note_content = data.get('note', '')
    print(note_content)
    response = get_response(note_content)
    return jsonify({'response': response})
# def api_get_prompt():
#     prompt = "Provide an engaging prompt to inspire note-taking:"
#     response = get_response(prompt)
#     return jsonify({'prompt': response})

if __name__ == '__main__':
    app.run(port=5000)

# Example usage
# if __name__ == "__main__":
    
#     new_info = ("Recent advancements in quantum computing and their potential impact on cryptography.")
    
#     knowledge_base = {
#         "title": ("Technology Trends"),
#         "pages": [
#             {"title": ("Quantum Computing Basics"), "content": "..."},
#             {"title": ("Modern Cryptography"), "content": "..."}
#         ]
#     }
    
#     updated_content = process_new_information(new_info, knowledge_base)
#     print("New content generated:", updated_content)

