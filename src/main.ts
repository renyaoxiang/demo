import * as async from 'async'
import axios from 'axios'
import * as _ from 'lodash'
import * as request from 'request'
class Action {
	public readonly name: string
	public readonly doAction: (context: Context) => void
	public readonly onFinish: () => void
	constructor(name: string, doAction: (context: Context) => void, onFinish: VoidFunction) {
		this.name = name
		this.doAction = doAction
		this.onFinish = onFinish
	}
}

interface Context {
	readonly name: string
	run(action: Action, next: () => void): void
}
class ContextService {
	private defaultContext = new DefaultContext()
	private contexts: Context[] = []
	public register(plugin: Context) {
		this.contexts.push(plugin)
	}
	public run(action: Action, next: () => void): void {
		async.allSeries(this.contexts, (context: Context, actionNext: () => void) => {
			action.doAction(context)
			actionNext()
		}, next)
	}

}
class DefaultContext implements Context {
	public readonly name: string = 'defaultContext'
	public run(action: Action, next: () => void) {
		action.doAction(this)
		next()
	}
}
class ActionService {
	public todoActions: Action[] = []
	public isRunning: boolean = false
	public contextService: ContextService = new ContextService()
	public run(name: string, action: (context: Context) => void, onFinish: () => void) {
		console.log('1')
		if (this.isRunning) {
			console.log('2')
			this.todoActions.push(new Action(name, action, onFinish))
		} else {
			console.log('3')
			this.runAction()
		}
	}
	public registerContext(plugin: Context) {
		this.contextService.register(plugin)
	}
	private runAction() {
		this.isRunning = true
		console.log('start')
		async.allSeries(this.takeActions(), (it: Action, next) => {
			console.log('start1')
			this.contextService.run(it, () => {
				it.onFinish()
				next()
			})
		}, () => {
			this.isRunning = false
			if (this.todoActions.length !== 0) {
				this.runAction()
			}
		})
	}

	private takeActions(): Action[] {
		const temp = this.todoActions
		this.todoActions = []
		return temp
	}
}
/**
 *
 *
 */
const start = () => {

	request('http://www.baidu.com', (error, response, body) => {
		console.log(response.headers);
		// Print the response status code if a response was received
		// console.log('body:', body); // Print the HTML for the Google homepage.
	});
	const actionService = new ActionService()
	class TimeContext implements Context {
		public name: string = _.uniqueId()
		public time: number = 0
		public run(action: Action, next: () => void) {
			this.time++
			action.doAction(this)
		}
	}
	actionService.registerContext(new TimeContext())
	actionService.run(_.uniqueId(), (context: TimeContext) => {
		console.log(context.time)
	}, () => {
		console.log(111)
	})
}
start()
